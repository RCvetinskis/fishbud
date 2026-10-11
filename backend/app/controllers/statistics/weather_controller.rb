module Statistics
  class WeatherController < ApplicationController
    before_action :authenticate_user!, only: %i[current_user_statistics]

    COMPASS_DIRECTIONS = %w[N NE E SE S SW W NW].freeze

    def index
      records = Weather.pluck(
        :temperature,
        :wind_speed,
        :wind_direction,
        :pressure
      )

      render json: {
        total_catches: records.size,
        best_temperature: best_range(records, 0, 5),
        best_wind_speed: best_range(records, 1, 5),
        best_wind_direction: best_direction(records),
        best_pressure: best_range(records, 3, 10)
      }
    end

    def current_user_statistics
      records = Weather
                .joins(:catch)
                .where(catches: { user_id: current_user.id })
                .pluck(
                  :temperature,
                  :wind_speed,
                  :wind_direction,
                  :pressure
                )

      render json: {
        total_catches: records.size,
        best_temperature: best_range(records, 0, 5),
        best_wind_speed: best_range(records, 1, 5),
        best_wind_direction: best_direction(records),
        best_pressure: best_range(records, 3, 10)
      }
    end

    private

    def best_range(records, column, interval)
      counts = records.filter_map do |record|
        value = record[column]
        next if value.nil?

        min = (value.to_f / interval).floor * interval
        [min, min + interval]
      end

      best = counts.tally.max_by { |_, count| count }
      return nil unless best

      (range, count) = best

      {
        min: range[0],
        max: range[1],
        catch_count: count
      }
    end

    def best_direction(records)
      directions = records.filter_map do |record|
        degrees = record[2]
        next if degrees.nil?

        index = (((degrees.to_f % 360) + 22.5) / 45).floor % 8
        COMPASS_DIRECTIONS[index]
      end

      best = directions.tally.max_by { |_, count| count }
      return nil unless best

      direction, count = best

      {
        direction: direction,
        catch_count: count
      }
    end
  end
end
