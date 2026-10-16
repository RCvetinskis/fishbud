module Statistics
  class LakeCatchesService < BaseService
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

    def filtered_catches
      scope = filter_by_period(
        Catch.all,
        column: 'COALESCE(catches.caught_at, catches.created_at)'
      )
      scope = scope.where(fish_id: selected_fish) if selected_fish != 'all'
      scope = scope.where(user_id: current_user.id) if current_user
      scope
    end

    def catches_by_lake(catches)
      Lake.joins(:catches)
          .where(catches: { id: catches.select(:id) })
          .select('lakes.id, lakes.name AS lake, COUNT(catches.id) AS count')
          .group('lakes.id, lakes.name')
          .order(Arel.sql('COUNT(catches.id) DESC'))
          .limit(10)
          .map do |record|
        {
          lake: record.lake,
          count: record.count.to_i
        }
      end
    end

    def catches_by_weather(catches)
      Weather.joins(:catch)
             .where(catches: { id: catches.select(:id) })
             .select(
               :temperature,
               :wind_direction,
               :pressure,
               'COUNT(*) AS count'
             )
             .group(:temperature, :wind_direction, :pressure)
             .order(Arel.sql('COUNT(*) DESC'))
             .limit(10)
             .map do |weather|
        {
          temperature: weather.temperature,
          wind_direction: Weather.compass_direction(weather.wind_direction),
          pressure: weather.pressure,
          count: weather.count.to_i
        }
      end
    end

    def catches_by_date(catches)
      relation = catches.except(:select, :order)

      if period == 'all'
        start_date = 52.weeks.ago.beginning_of_week

        relation = relation.where(
          'COALESCE(catches.caught_at, catches.created_at) >= ?',
          start_date
        )
      end

      date_sql = Arel.sql(
        'DATE(COALESCE(catches.caught_at, catches.created_at))'
      )

      relation
        .group(date_sql)
        .count
        .map do |date, count|
          {
            date: date.to_s,
            count: count
          }
        end
        .sort_by { |record| record[:date] }
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
