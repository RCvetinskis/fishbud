class Catch < ApplicationRecord
  belongs_to :fish
  belongs_to :user
  belongs_to :lake

  validates :fish, presence: true
  validates :user, presence: true
end
