require 'json'
require 'time'

module WeatherServices
  class FetchForCatch
    FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
    ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive'

    FORECAST_PAST_DAYS = 90
    FORECAST_FUTURE_DAYS = 15

    HOURLY_FIELDS = %w[
      temperature_2m
      apparent_temperature
      relative_humidity_2m
      precipitation
      rain
      precipitation_probability
      cloud_cover
      wind_speed_10m
      wind_direction_10m
      wind_gusts_10m
      pressure_msl
      weather_code
    ].freeze

    def self.call(catch:)
      new(catch).call
    end

    def initialize(catch)
      @catch = catch
    end

    def call
      return unless @catch.lake&.latitude && @catch.lake.longitude

      target_time = @catch.caught_at || @catch.created_at
      return unless target_time

      target_date = target_time.to_date
      today = Time.zone.today

      url, date_params = api_config(target_date, today)
      return unless url

      response = Faraday.get(
        url,
        {
          latitude: @catch.lake.latitude,
          longitude: @catch.lake.longitude,
          hourly: HOURLY_FIELDS.join(','),
          wind_speed_unit: 'kmh',
          timezone: Time.zone.tzinfo.name
        }.merge(date_params)
      )

      raise "Open-Meteo returned HTTP #{response.status}: #{response.body}" unless response.success?

      data = JSON.parse(response.body)
      hourly = data.fetch('hourly')
      times = hourly.fetch('time')

      return if times.empty?

      index = times.each_index.min_by do |i|
        weather_time = Time.zone.parse(times[i])
        (weather_time - target_time).abs
      end

      observed_at = Time.zone.parse(times[index])

      attributes = {
        observed_at: observed_at,
        source: 'open_meteo',
        temperature: hourly.dig('temperature_2m', index),
        feels_like: hourly.dig('apparent_temperature', index),
        humidity: hourly.dig('relative_humidity_2m', index),
        precipitation: hourly.dig('precipitation', index),
        rain: hourly.dig('rain', index),
        precipitation_probability: hourly.dig('precipitation_probability', index),
        cloud_cover: hourly.dig('cloud_cover', index),
        wind_speed: hourly.dig('wind_speed_10m', index),
        wind_direction: hourly.dig('wind_direction_10m', index),
        wind_gusts: hourly.dig('wind_gusts_10m', index),
        pressure: hourly.dig('pressure_msl', index),
        weather_code: hourly.dig('weather_code', index)
      }

      @catch.create_weather!(attributes)
    rescue StandardError => e
      Rails.logger.warn(
        "[WeatherServices::FetchForCatch] Catch ##{@catch.id}: " \
        "#{e.class}: #{e.message}"
      )

      nil
    end

    private

    def api_config(target_date, today)
      days_ago = (today - target_date).to_i
      days_ahead = (target_date - today).to_i

      if days_ago.between?(0, FORECAST_PAST_DAYS)
        [
          FORECAST_URL,
          {
            past_days: [days_ago + 1, 1].max,
            forecast_days: 1
          }
        ]
      elsif days_ahead.between?(0, FORECAST_FUTURE_DAYS)
        [
          FORECAST_URL,
          {
            past_days: 1,
            forecast_days: days_ahead + 1
          }
        ]
      elsif target_date < today
        [
          ARCHIVE_URL,
          {
            start_date: target_date.iso8601,
            end_date: target_date.iso8601
          }
        ]
      else
        Rails.logger.warn(
          "[WeatherServices::FetchForCatch] Catch ##{@catch.id}: " \
          "Target date #{target_date} is outside the supported forecast range."
        )

        nil
      end
    end
  end
end
