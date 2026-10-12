module Statistics
  class LakeCatchesService
    PERIODS = {
      '7d' => 7.days,
      '30d' => 30.days,
      '90d' => 90.days,
      'all' => nil
    }.freeze

    def initialize(period: '7d')
      @period = PERIODS.key?(period) ? period : '7d'
    end

    def call
      catches = filtered_catches

      {
        total_catches: catches.count,
        catches_by_date: catches_by_date(catches),
        catches_by_lake: catches_by_lake(catches),
        catches_by_weather: catches_by_weather(catches),
        top_lake: top_lake(catches),
        top_weather: top_weather(catches),
        average_temperature: average_temperature(catches),
        biggest_catches: biggest_catches(catches)
      }
    end

    private

    def filtered_catches
      catches = Catch.all
      return catches if @period == 'all'

      start_date = PERIODS.fetch(@period).ago

      catches.where(
        'COALESCE(catches.caught_at, catches.created_at) BETWEEN ? AND ?',
        start_date,
        Time.current
      )
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
             .group(:temperature, :wind_direction)
             .count
             .map do |(temperature, wind_direction), count|
        {
          temperature: temperature,
          wind_direction: wind_direction,
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

    def top_weather(catches)
      catches_by_weather(catches).max_by { |item| item[:count] }
    end

    def average_temperature(catches)
      Weather.joins(:catch)
             .where(catches: { id: catches.select(:id) })
             .average(:temperature)&.round(1)
    end

    def biggest_catches(catches)
      catches.includes(:lake, :fish, :user)
             .where.not(length: nil)
             .order(length: :desc, weight: :desc, created_at: :desc)
             .limit(10)
             .map do |catch|
        {
          id: catch.id,
          fish: catch.fish&.name,
          username: catch.user&.username,
          length: catch.length,
          weight: catch.weight,
          lake_name: catch.lake.name,
          lake_id: catch.lake.id,
          date: (catch.caught_at || catch.created_at)&.to_date
        }
      end
    end
  end
end
