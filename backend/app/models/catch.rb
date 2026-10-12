class Catch < ApplicationRecord
  belongs_to :fish
  belongs_to :user
  belongs_to :lake
  belongs_to :fishing_trip, optional: true

  has_one :weather, dependent: :destroy
  has_one_attached :image

  validates :fish, presence: true
  validates :user, presence: true

  validates :weight,
            numericality: {
              greater_than: 0,
              less_than_or_equal_to: 500
            },
            allow_blank: true

  validates :length,
            numericality: {
              greater_than: 0,
              less_than_or_equal_to: 1000
            },
            allow_blank: true

  validate :image_must_be_an_image
  validate :caught_at_cannot_be_in_the_future

  scope :heaviest_first, lambda {
    order(Arel.sql('weight DESC NULLS LAST'))
  }

  scope :longest_first, lambda {
    order(Arel.sql('length DESC NULLS LAST'))
  }
  scope :heaviest_and_longest_first, lambda {
    order(
      Arel.sql('weight DESC NULLS LAST'),
      Arel.sql('length DESC NULLS LAST')
    )
  }

  private

  def caught_at_cannot_be_in_the_future
    return if caught_at.blank?
    return unless caught_at > Time.current

    errors.add(:caught_at, "can't be in the future")
  end

  def image_must_be_an_image
    return unless image.attached?

    return if image.blob.content_type&.start_with?('image/')

    errors.add(:image, 'must be an image')
  end
end
