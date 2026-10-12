class SpotSerializer < ActiveModel::Serializer
  attributes :id, :lake_id, :name, :description, :latitude, :longitude
end
