require 'json'
require 'time'

module WeatherServices
  class FetchForCatch
    BASE_URL = 'https://api.open-meteo.com/v1/forecast'

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

      response = Faraday.get(BASE_URL, {
                               latitude: @catch.lake.latitude,
                               longitude: @catch.lake.longitude,
                               hourly: HOURLY_FIELDS.join(','),
                               wind_speed_unit: 'kmh',
                               past_days: 1,
                               forecast_days: 1,
                               timezone: Time.zone.tzinfo.name
                             })

      raise "Open-Meteo returned HTTP #{response.status}" unless response.success?

      data = JSON.parse(response.body)
      hourly = data.fetch('hourly')
      times = hourly.fetch('time')

      return if times.empty?

      index = times.each_index.min_by do |i|
        (Time.strptime(times[i], '%Y-%m-%dT%H:%M').utc - @catch.created_at.utc).abs
      end

      attributes = {
        observed_at: Time.strptime(times[index], '%Y-%m-%dT%H:%M').utc,
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
        "[Weather::FetchForCatch] Catch ##{@catch.id}: " \
        "#{e.class}: #{e.message}"
      )

      nil
    end
  end
end
