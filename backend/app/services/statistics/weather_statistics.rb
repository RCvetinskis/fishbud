module Statistics
  class WeatherStatistics < BaseService
    def initialize(current_user: nil)
      @current_user = current_user
    end

    def call
      records = weather_records

      {
        total_catches: records.size,
        best_temperature: best_range(records, 0, 5),
        best_wind_speed: best_range(records, 1, 5),
        best_wind_direction: best_direction(records),
        best_pressure: best_range(records, 3, 10)
      }
    end

    private

    attr_reader :current_user

    def weather_records
      scope = Weather.all

      scope = scope.joins(:catch).where(catches: { user_id: current_user.id }) if current_user

      scope.pluck(
        :temperature,
        :wind_speed,
        :wind_direction,
        :pressure
      )
    end

    def best_range(records, column, interval)
      counts = records.filter_map do |record|
        value = record[column]
        next if value.nil?

        min = (value.to_f / interval).floor * interval
        [min, min + interval]
      end

      best = counts.tally.max_by { |_, count| count }
      return unless best

      range, count = best

      {
        min: range[0],
        max: range[1],
        catch_count: count
      }
    end

    def best_direction(records)
      directions = records.filter_map do |record|
        Weather.compass_direction(record[2])
      end

      best = directions.tally.max_by { |_, count| count }
      return unless best

      direction, count = best

      {
        direction: direction,
        catch_count: count
      }
    end
  end
end
