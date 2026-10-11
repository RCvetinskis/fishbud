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
end
