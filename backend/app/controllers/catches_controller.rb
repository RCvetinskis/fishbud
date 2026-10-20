class CatchesController < ApplicationController
  before_action :authenticate_user!, only: %i[create]
  before_action :set_lake, only: %i[lake_catches]
  before_action :set_lure, only: %i[lure_catches]

  def create
    catch = current_user.catches.new(catch_params)

    if catch.save
      WeatherServices::FetchForCatch.call(catch: catch)
      render_success(catch)
    else
      render_error(catch.errors.full_messages.first)
    end
  end

  def lake_catches
    return render_not_found unless @lake

    catches = Catches::Search.call(scope: @lake.catches, params: params)
    catches = catches.page(params[:page]).per(per_page)

    render_success(
      {
        result: serialize_collection(catches, CatchSerializer),
        meta: pagination_dict(catches)
      }
    )
  rescue Date::Error
    render_error('Invalid date filter. Use YYYY-MM-DD.')
  end

  def lure_catches
    return render_not_found unless @lure

    catches = Catches::Search.call(scope: @lure.catches, params: params)
    catches = catches.page(params[:page]).per(per_page)

    render_success(
      {
        result: serialize_collection(catches, CatchSerializer),
        meta: pagination_dict(catches)
      }
    )
  rescue Date::Error
    render_error('Invalid date filter. Use YYYY-MM-DD.')
  end

  private

  def catch_params
    params.require(:catch).permit(:fish_id, :lake_id, :fishing_trip_id, :description, :lure, :weight, :length, :image,
                                  :caught_at, :lure_id)
  end

  def set_lake
    @lake = Lake.find_by(id: params[:lake_id])
  end

  def set_lure
    @lure = Lure.find_by(id: params[:lure_id])
  end
end
