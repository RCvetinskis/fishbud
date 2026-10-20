module Statistics
  class LuresController < ApplicationController
    before_action :set_scope
    before_action :authenticate_scope_user!, if: -> { @scope == 'mine' }
    before_action :set_user, if: -> { @scope == 'mine' }
    before_action :set_lure, only: %i[show]

    def index
      result = Statistics::LureStatistics.new(
        period: params[:period].presence || '7d',
        selected_fish: params[:fish_id].presence || 'all',
        selected_lure: params[:lure_id].presence || 'all',
        current_user: @user,
        sort_params: params[:sort_params].presence,
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

    def show
      return render_not_found unless @lure

      render_success(serialize_resource(@lure, Statistics::LureSerializer))
    end

    private

    def authenticate_scope_user!
      authenticate_user!
    end

    def set_scope
      @scope = params[:scope] == 'mine' ? 'mine' : 'all'
    end

    def set_user
      return if performed?

      @user = current_user
    end

    def set_lure
      @lure = Lure.find_by(id: params[:id])
    end
  end
end
