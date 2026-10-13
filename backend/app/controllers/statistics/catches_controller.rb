module Statistics
  class CatchesController < ApplicationController
    before_action :set_period
    def index
      scope = params[:scope] || 'all'

      if scope == 'mine'
        authenticate_user!
        return if performed?
      end

      user = current_user if scope == 'mine'

      result = Statistics::LakeCatchesService.new(period: @period, current_user: user).call

      render_success(result)
    end

    def top_catches
      result = Statistics::TopCatchesService.new(period: @period).call

      render_success(result)
    end

    def top_fishing_trips
      result = TopFishingTripsService.new(period: @period).call

      render_success(result)
    end

    private

    def set_period
      @period = params[:period].presence || '7d'
    end
  end
end
