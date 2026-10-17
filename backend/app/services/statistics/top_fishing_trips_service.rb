module Statistics
  class TopFishingTripsService < BaseService
    def call
      top_fishing_trips(filtered_fishing_trips)
    end

    private

    def filtered_fishing_trips
      scope = filter_by_period(
        FishingTrip.all,
        column: 'fishing_trips.started_at'
      )
      if selected_fish != 'all'
        scope = scope.joins(:catch)
                     .where(catches: { fish_id: selected_fish })
                     .where(fish_id: selected_fish)
      end
      scope = scope.where(user_id: current_user.id) if current_user
      scope
    end

    def top_fishing_trips(trips)
      scope = trips
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
                Arel.sql('COUNT(catches.id) DESC'),
                Arel.sql('fishing_trips.id DESC')
              )

      paginated = scope.page(page).per(LIMIT)
      {
        items: paginated,
        pagination: pagination_dict(paginated)
      }
    end
  end
end
