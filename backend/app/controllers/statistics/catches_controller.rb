module Statistics
  class CatchesController < ApplicationController
    before_action :set_period
    before_action :set_scope
    before_action :set_fish
    before_action :authenticate_scope_user!, if: -> { @scope == 'mine' }
    before_action :set_user,                 if: -> { @scope == 'mine' }

    def index
      result = Statistics::LakeCatchesService.new(
        period: @period,
        selected_fish: @fish,
        current_user: @user
      ).call

      render_success(result)
    end

    def top_catches
      result = Statistics::TopCatchesService.new(
        period: @period,
        selected_fish: @fish,
        current_user: @user,
        page: params[:page]
      ).call

      if result.is_a?(Hash) && result[:pagination]
        render_success({
                         items: result[:items],
                         meta: result[:pagination]
                       })
      else
        render_success(result)
      end
    end

    def top_fishing_trips
      result = Statistics::TopFishingTripsService.new(
        period: @period,
        selected_fish: @fish,
        current_user: @user,
        page: params[:page]
      ).call

      if result.is_a?(Hash) && result[:pagination]
        render_success(
          items: result[:items],
          meta: result[:pagination]
        )
      else
        render_success(result)
      end
    end

    private

    def set_period
      @period = params[:period].presence || '7d'
    end

    def set_scope
      @scope = params[:scope] == 'mine' ? 'mine' : 'all'
    end

    def set_fish
      @fish = params[:fish_id].presence || 'all'
    end

    def authenticate_scope_user!
      authenticate_user!
    end

    def set_user
      return if performed?

      @user = current_user
    end
  end
end
