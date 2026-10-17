module Statistics
  class LuresController < ApplicationController
    before_action :set_period
    before_action :set_scope
    before_action :set_fish
    before_action :authenticate_scope_user!, if: -> { @scope == 'mine' }
    before_action :set_user, if: -> { @scope == 'mine' }
    def index
      # TODO: Select by lure
      # TODO: Sorty by lure catches count and fish name
      # TODO: Select by lure type as well

      # TODO: DIsplay of item record average time period for example june-july 2026, and display average weather
      # condition, temperature, wind speed, pressure, and wind direction,  for the period
      # TODO: instead of select date by all 90 30 7 days, add option to select by date range
      result = Statistics::LureStatistics.new(
        period: @period,
        selected_fish: @fish,
        current_user: @user,
        page: params[:page]
      ).call

      if result.is_a?(Hash) && result[:pagination]
        render_success({
                         items: result[:items],
                         meta: result[:pagination],
                         summary: result[:summary]
                       })
      else
        render_success(result)
      end
    end

    def authenticate_scope_user!
      authenticate_user!
    end

    def set_period
      @period = params[:period].presence || '7d'
    end

    def set_scope
      @scope = params[:scope] == 'mine' ? 'mine' : 'all'
    end

    def set_fish
      @fish = params[:fish_id].presence || 'all'
    end

    def set_user
      return if performed?

      @user = current_user
    end
  end
end
