class Lure < ApplicationRecord
  has_many :catches

  LURE_TYPES = %w[natural artificial].freeze

  validates :name, presence: true,
                   uniqueness: { case_sensitive: false },
                   length: { maximum: 50 }

  def self.top_10_lures
    joins(:catches)
      .group('lures.id')
      .select('lures.*, COUNT(catches.id) AS catches_count')
      .order('catches_count DESC')
      .limit(10)
  end
end
