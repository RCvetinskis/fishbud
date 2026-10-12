module Statistics
  class LakeCatchesController < ApplicationController
    def index
      period = params[:period].presence || '7d'

      return render render_error('Invalid period') unless %w[7d 30d 90d all].include?(period)

      statistics = Statistics::LakeCatchesService.new(period: period).call

      render_success(statistics)
    end
  end
end
