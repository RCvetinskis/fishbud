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

  def wind_direction_compass
    self.class.compass_direction(wind_direction)
  end

  def self.compass_direction(degrees)
    return if degrees.nil?

    COMPASS_DIRECTIONS[((degrees.to_f % 360 + 22.5) / 45).floor % 8]
  end
end
