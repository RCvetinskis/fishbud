module Geo
  class FeatureCollectionService
    def self.empty
      { type: 'FeatureCollection', features: [] }
    end

    # Relation must select :id, :name, :area, and a `geojson` column.
    def self.from_lakes(relation)
      {
        type: 'FeatureCollection',
        features: relation.map do |lake|
          {
            type: 'Feature',
            properties: { id: lake.id, name: lake.name, area: lake.area },
            geometry: JSON.parse(lake.geojson)
          }
        end
      }
    end
  end
end
