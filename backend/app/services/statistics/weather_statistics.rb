module Statistics
  class WeatherStatistics < BaseService
    LIMIT = 10

    def call
      records = weather_records

      {
        total_catches: records.size,
        best_temperatures: best_ranges(records, 0, 5),
        best_wind_speeds: best_ranges(records, 1, 5),
        best_wind_directions: best_directions(records),
        best_pressures: best_ranges(records, 3, 10)
      }
    end

    private

    def weather_records
      scope = filter_by_period(
        Weather.all,
        column: 'observed_at'
      )

      needs_catch_join =
        selected_fish != 'all' ||
        current_user.present? ||
        selected_lure.present?

      scope = scope.joins(:catch) if needs_catch_join

      scope = scope.where(catches: { fish_id: selected_fish }) if selected_fish != 'all'

      scope = scope.where(catches: { user_id: current_user.id }) if current_user.present?

      scope.pluck(:temperature, :wind_speed, :wind_direction, :pressure)
    end

    def best_ranges(records, column, interval)
      records.filter_map do |record|
        value = record[column]
        next if value.nil?

        min = (value.to_f / interval).floor * interval
        [min, min + interval]
      end
      .tally
      .sort_by { |range, count| [-count, range[0]] }
             .first(LIMIT)
             .map do |range, count|
        {
          min: range[0],
          max: range[1],
          catch_count: count
        }
      end
    end

    def best_directions(records)
      records.filter_map do |record|
        Weather.compass_direction(record[2]) unless record[2].nil?
      end
      .tally
      .sort_by { |direction, count| [-count, direction] }
             .first(LIMIT)
             .map do |direction, count|
        {
          direction: direction,
          catch_count: count
        }
      end
    end
  end
end
