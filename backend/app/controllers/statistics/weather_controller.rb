module Statistics
  class WeatherController < ApplicationController
    def index
      scope = params[:scope] || 'all'

      if scope == 'mine'
        authenticate_user!
        return if performed?
      end

      user = current_user if scope == 'mine'

      render json: Statistics::WeatherStatistics.new(
        current_user: user
      ).call
    end
  end
end
