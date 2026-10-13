module Statistics
  class LakeCatchesService < BaseService
    def initialize(period: nil, current_user: nil)
      super(period: period)
      @current_user = current_user
    end

    def call
      catches = filtered_catches

      {
        total_catches: catches.count,
        catches_by_date: catches_by_date(catches),
        catches_by_lake: catches_by_lake(catches),
        catches_by_weather: catches_by_weather(catches),
        top_lake: top_lake(catches),
        top_fish: top_fish(catches),
        top_angler: top_angler(catches)

      }
    end

    private

    attr_reader :current_user

    def filtered_catches
      catches = filter_by_period(
        Catch.all,
        column: 'COALESCE(catches.caught_at, catches.created_at)'
      )
      catches = catches.where(user_id: current_user.id) if current_user
      catches
    end

    def catches_by_lake(catches)
      catches.joins(:lake)
             .group('lakes.name')
             .order(Arel.sql('COUNT(catches.id) DESC'))
             .count
             .map { |lake, count| { lake: lake, count: count } }
    end

    def catches_by_weather(catches)
      Weather.joins(:catch)
             .where(catches: { id: catches.select(:id) })
             .group(:temperature, :wind_direction, :pressure)
             .count
             .map do |(temperature, wind_direction, pressure), count|
        {
          temperature: temperature,
          wind_direction: Weather.compass_direction(wind_direction),
          pressure: pressure,
          count: count
        }
      end
    end

    def catches_by_date(catches)
      catches.group(
        Arel.sql('DATE(COALESCE(catches.caught_at, catches.created_at))')
      ).count
             .sort_by { |date, count| [-count, -date.jd] }
             .map { |date, count| { date: date, count: count } }
    end

    def top_lake(catches)
      catches_by_lake(catches).first
    end

    def top_fish(catches)
      result = catches.joins(:fish)
                      .group('fish.id', 'fish.name')
                      .order(Arel.sql('COUNT(catches.id) DESC'))
                      .count
                      .first

      return nil unless result

      (fish_id, fish_name), count = result

      {
        fish_id: fish_id,
        fish_name: fish_name,
        count: count
      }
    end

    def top_angler(catches)
      result = catches.joins(:user)
                      .group('users.id', 'users.username')
                      .order(Arel.sql('COUNT(catches.id) DESC'))
                      .count
                      .first

      return nil unless result

      (user_id, username), count = result

      {
        user_id: user_id,
        username: username,
        count: count
      }
    end
  end
end
