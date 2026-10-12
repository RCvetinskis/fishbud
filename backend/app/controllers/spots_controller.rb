class SpotsController < ApplicationController
  before_action :authenticate_user!, only: %i[create]

  def index
    spots = Spot.all
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

  private

  def spot_params
    params.require(:spot).permit(
      :lake_id,
      :name,
      :description,
      :latitude,
      :longitude
    )
  end
end
