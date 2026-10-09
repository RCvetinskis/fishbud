class LakesController < ApplicationController
  before_action :set_lake, only: %i[show]

  def show
    if @lake
      render_success(serialize_resource(@lake, LakeSerializer))
    else
      render_not_found
    end
  end

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

  private

  def set_lake
    @lake = Lake.find_by(id: params[:id])
  end
end
