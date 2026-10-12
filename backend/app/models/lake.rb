class Lake < ApplicationRecord
  has_many :catches, dependent: :destroy
  has_many :fishing_trips, dependent: :destroy
  has_many :spots, dependent: :destroy
end
