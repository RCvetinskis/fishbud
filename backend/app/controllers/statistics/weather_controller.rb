module Statistics
  class WeatherController < ApplicationController
    before_action :set_period
    before_action :set_scope
    before_action :authenticate_scope_user!, if: -> { @scope == 'mine' }
    before_action :set_user,                     if: -> { @scope == 'mine' }

    def index
      render json: Statistics::WeatherStatistics.new(
        period: @period,
        selected_fish: params[:fish_id].presence || 'all',
        current_user: @user
      ).call
    end

    private

    def set_period
      @period = params[:period].presence || '7d'
    end

    def set_scope
      @scope = params[:scope] == 'mine' ? 'mine' : 'all'
    end

    def authenticate_scope_user!
      authenticate_user!
    end

    def set_user
      @user = current_user
    end
  end
end
