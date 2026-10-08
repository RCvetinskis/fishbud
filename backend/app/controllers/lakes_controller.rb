class LakesController < ApplicationController
  def index
    lakes = Lake.select(
      :id,
      :name,
      :area,
      Arel.sql(<<~SQL.squish)
        ST_AsGeoJSON(
          ST_Transform(
            ST_SimplifyPreserveTopology(geometry, 10),
            4326
          )
        ) AS geojson
      SQL
    )

    features = lakes.map do |lake|
      {
        type: 'Feature',
        properties: {
          id: lake.id,
          name: lake.name,
          area: lake.area
        },
        geometry: JSON.parse(lake.geojson)
      }
    end

    render json: {
      type: 'FeatureCollection',
      features: features
    }
  end
end
