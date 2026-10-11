class Fish < ApplicationRecord
  has_many :catches, dependent: :destroy
end
