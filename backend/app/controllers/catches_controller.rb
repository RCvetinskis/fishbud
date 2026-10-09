class CatchesController < ApplicationController
  before_action :authenticate_user!, only: %i[create]
  before_action :set_lake, only: %i[lake_catches]
  def create
    catch = current_user.catches.new(catch_params)

    if catch.save
      render_success(catch)
    else
      render_error(catch.errors.full_messages.first)
    end
  end

  def lake_catches
    return render_not_found unless @lake

    catches = @lake.catches.order(created_at: :desc).page(params[:page]).per(per_page)

    render_success({ result: serialize_collection(catches, CatchSerializer), meta: pagination_dict(catches) })
  end

  private

  def catch_params
    params.require(:catch).permit(:fish_id, :lake_id, :description, :lure)
  end

  def set_lake
    @lake = Lake.find_by(id: params[:lake_id])
  end
end
