class FishingTrip < ApplicationRecord
  belongs_to :user
  belongs_to :lake

  has_many :catches, dependent: :nullify

  enum :status, {
    in_progress: 'in_progress',
    completed: 'completed'
  }

  validates :started_at, presence: true
  validate :user_has_no_other_active_trip, if: :in_progress?

  private

  def user_has_no_other_active_trip
    existing_trip = user.fishing_trips
                        .where(status: 'in_progress')
                        .where.not(id: id)
                        .exists?

    return unless existing_trip

    errors.add(:base, 'You already have an active fishing trip. Finish it before starting another.')
  end
end
