class LakesController < ApplicationController
  before_action :set_lake, only: %i[show lake_statistics]

  def show
    return render_not_found unless @lake

    lake = Lake
           .where(id: @lake.id)
           .select(
             :id, :name, :area, :length, :width, :shoreline_length,
             :latitude, :longitude, :geometry,
             Arel.sql(
               'ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geojson'
             )
           )
           .first

    render_success(serialize_resource(lake, LakeSerializer))
  end

  def index
    zoom   = params[:zoom].to_i.clamp(1, 18)
    search = params[:search].to_s.strip

    return render_lake_search(search) if search.present?

    max_features, tolerance = TierService.for_lakes(zoom)
    return render json: Geo::FeatureCollectionService.empty if max_features == 0

    lakes = base_scope(tolerance)
            .order(Arel.sql('area DESC NULLS LAST'))

    lakes = with_bounds(lakes)
    lakes = lakes.limit(max_features) if max_features

    render json: Geo::FeatureCollectionService.from_lakes(lakes)
  end

  def suggest
    data = Search::SuggestionsService.call(scope: Lake.all, query: params[:q], limit: params[:limit])
    render json: { data: data }
  end

  def lake_statistics
    return render_not_found unless @lake

    render_success(Lakes::SummaryStatistics.call(lake_id: @lake.id))
  end

  private

  def set_lake
    @lake = Lake.find_by(id: params[:id])
  end

  def render_lake_search(search)
    lakes = Lake.where.not(geometry: nil)
                .select(
                  :id, :name, :area,
                  Arel.sql('ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geojson')
                )

    lakes = Search::RankedScopeService.call(scope: lakes, query: search, limit: 50)
    render json: Geo::FeatureCollectionService.from_lakes(lakes)
  end

  def base_scope(tolerance)
    Lake.where.not(geometry: nil).select(
      :id, :name, :area,
      Arel.sql(<<~SQL.squish)
        ST_AsGeoJSON(
          ST_Transform(
            ST_SimplifyPreserveTopology(geometry, #{tolerance}),
            4326
          )
        ) AS geojson
      SQL
    )
  end

  def with_bounds(scope)
    return scope unless params.values_at(:south, :west, :north, :east).all?(&:present?)

    south, west, north, east =
      params.values_at(:south, :west, :north, :east).map(&:to_f)

    return scope unless south < north && west < east

    scope.where(<<~SQL.squish, west, south, east, north)
      ST_Intersects(
        geometry,
        ST_Transform(ST_MakeEnvelope(?, ?, ?, ?, 4326), 3346)
      )
    SQL
  end
end
