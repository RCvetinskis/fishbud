class Spot < ApplicationRecord
  METER_RADIUS = 500
  belongs_to :user
  belongs_to :lake
  before_validation :generate_default_name, on: :create

  validates :name, presence: true
  validates :latitude, numericality: { in: -90..90 }
  validates :longitude, numericality: { in: -180..180 }

  validate :within_lake_radius

  private

  def generate_default_name
    return if name.present? || lake.nil?

    self.name = "#{lake.name} #{lake.spots.count + 1} spot"
  end

  def within_lake_radius
    return if lake_id.blank? || latitude.blank? || longitude.blank?

    valid = Lake.where(id: lake_id).where(
      <<~SQL.squish,
        ST_DWithin(
          geometry,
          ST_Transform(
            ST_SetSRID(ST_MakePoint(?, ?), 4326),
            3346
          ),
          ?
        )
      SQL
      longitude,
      latitude,
      METER_RADIUS
    ).exists?

    errors.add(:base, "Spot must be within #{METER_RADIUS} meters of the lake") unless valid
  end
end
