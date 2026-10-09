class Lake < ApplicationRecord
  has_many :catches, dependent: :destroy
end
