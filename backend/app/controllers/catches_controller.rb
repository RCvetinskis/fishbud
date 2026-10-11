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

    catches = @lake.catches
    catches = catches.where(fish_id: params[:fish_id]) if params[:fish_id].present?

    if params[:date_from].present?
      catches = catches.where(
        'created_at >= ?',
        Date.iso8601(params[:date_from]).beginning_of_day
      )
    end

    if params[:date_to].present?
      catches = catches.where(
        'created_at <= ?',
        Date.iso8601(params[:date_to]).end_of_day
      )
    end

    catches = case params[:sort_by]
              when 'oldest'
                catches.order(created_at: :asc)
              when 'heaviest'
                catches.heaviest_first
              when 'lightest'
                catches.order(Arel.sql('weight ASC NULLS LAST'))
              when 'longest'
                catches.longest_first
              when 'shortest'
                catches.order(Arel.sql('length ASC NULLS LAST'))
              else
                catches.order(created_at: :desc)
              end

    catches = catches.page(params[:page]).per(per_page)

    render_success(
      {
        result: serialize_collection(catches, CatchSerializer),
        meta: pagination_dict(catches)
      }
    )
  end

  private

  def catch_params
    params.require(:catch).permit(:fish_id, :lake_id, :description, :lure, :weight, :length, :image)
  end

  def set_lake
    @lake = Lake.find_by(id: params[:lake_id])
  end
end
