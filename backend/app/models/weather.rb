class Weather < ApplicationRecord
  belongs_to :catch

  validates :observed_at, presence: true
  validates :humidity, inclusion: { in: 0..100 }, allow_nil: true
  validates :cloud_cover, inclusion: { in: 0..100 }, allow_nil: true
  validates :precipitation_probability,
            inclusion: { in: 0..100 },
            allow_nil: true
  validates :wind_direction,
            inclusion: { in: 0..359 },
            allow_nil: true

  COMPASS_DIRECTIONS = %w[N NE E SE S SW W NW].freeze
  PRESSURE_RANGE = 5
  TEMPERATURE_RANGE = 5

  def wind_direction_compass
    self.class.compass_direction(wind_direction)
  end

  def self.compass_direction(degrees)
    return if degrees.nil?

    COMPASS_DIRECTIONS[((degrees.to_f % 360 + 22.5) / 45).floor % 8]
  end

  def self.most_common_by_catches(catches)
    temperature_range = Arel.sql(
      "FLOOR(weathers.temperature / #{TEMPERATURE_RANGE}.0)"
    )
    pressure_range = Arel.sql(
      "FLOOR(weathers.pressure / #{PRESSURE_RANGE}.0)"
    )
    direction_range = Arel.sql(
      'FLOOR(MOD(weathers.wind_direction + 22.5, 360) / 45.0)'
    )

    catches
      .joins(:weather)
      .where.not(
        weathers: {
          temperature: nil,
          pressure: nil,
          wind_direction: nil
        }
      )
      .group(temperature_range, pressure_range, direction_range)
      .order(Arel.sql('COUNT(catches.id) DESC'))
      .limit(1)
      .pluck(
        Arel.sql(
          "FLOOR(weathers.temperature / #{TEMPERATURE_RANGE}.0) * #{TEMPERATURE_RANGE}"
        ),
        Arel.sql(
          "FLOOR(weathers.pressure / #{PRESSURE_RANGE}.0) * #{PRESSURE_RANGE}"
        ),
        direction_range,
        Arel.sql('COUNT(catches.id)')
      )
      .first
      &.then do |temperature_min, pressure_min, direction_index, count|
        {
          temperature_min: temperature_min,
          temperature_max: temperature_min + TEMPERATURE_RANGE,
          pressure_min: pressure_min,
          pressure_max: pressure_min + PRESSURE_RANGE,
          wind_direction: COMPASS_DIRECTIONS[direction_index.to_i % 8],
          catches_count: count
        }
      end
  end
end
