module Statistics
  class TopFishingTripsService < BaseService
    def call
      top_fishing_trips
    end

    private

    def top_fishing_trips
      filtered_fishing_trips
        .where(status: 'completed')
        .joins(:catches, :lake)
        .select(
          'fishing_trips.*',
          'lakes.name AS lake_name',
          'COUNT(catches.id) AS catches_count',
          'COALESCE(SUM(catches.weight), 0) AS total_weight',
          'COALESCE(SUM(catches.length), 0) AS total_length'
        )
        .group('fishing_trips.id', 'lakes.name')
        .order(
          Arel.sql('COALESCE(SUM(catches.weight), 0) DESC'),
          Arel.sql('COALESCE(SUM(catches.length), 0) DESC'),
          Arel.sql('COUNT(catches.id) DESC')
        )
        .limit(LIMIT)
    end

    def filtered_fishing_trips
      filter_by_period(
        FishingTrip.all,
        column: 'fishing_trips.started_at'
      )
    end
  end
end
