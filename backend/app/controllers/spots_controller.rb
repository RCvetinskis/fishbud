
class SpotsController < ApplicationController
  before_action :authenticate_user!, only: %i[create]

  def index
    zoom   = params[:zoom].to_i.clamp(1, 18)
    search = params[:search].to_s.strip

    return render_spot_search(search) if search.present?

    max_features = TierService.for_spots(zoom)
    return render json: { data: [] } if max_features == 0

    spots = Spot.order(created_at: :desc)
    spots = with_bounds(spots)
    spots = spots.limit(max_features) if max_features

    render_success(serialize_collection(spots, SpotSerializer))
  end

  def create
    spot = current_user.spots.new(spot_params)

    if spot.save
      render_created(spot)
    else
      render_error(spot.errors.full_messages.first)
    end
  end

  def suggest
    data = Search::SuggestionsService.call(scope: Spot.all, query: params[:q], limit: params[:limit])
    render json: { data: data }
  end

  private

  def render_spot_search(search)
    spots = Search::RankedScopeService.call(scope: Spot.all, query: search, limit: 50)
    render_success(serialize_collection(spots, SpotSerializer))
  end

  def with_bounds(scope)
    return scope unless params.values_at(:south, :west, :north, :east).all?(&:present?)

    south, west, north, east =
      params.values_at(:south, :west, :north, :east).map(&:to_f)

    return scope unless south < north && west < east

    scope.where(latitude: south..north, longitude: west..east)
  end

  def spot_params
    params.require(:spot).permit(:lake_id, :name, :description, :latitude, :longitude)
  end
end