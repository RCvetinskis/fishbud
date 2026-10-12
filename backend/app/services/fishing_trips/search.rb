module FishingTrips
  class Search
    def self.call(lake:, params:, per_page:)
      new(lake, params, per_page).call
    end

    def initialize(lake, params, per_page)
      @lake = lake
      @params = params
      @per_page = per_page
    end

    def call
      trips = @lake.fishing_trips
      trips = filter_by_date(trips)
      trips = sort(trips)

      trips
        .includes(catches: %i[fish weather])
        .page(@params[:page])
        .per(@per_page)
    end

    private

    def filter_by_date(trips)
      if @params[:date_from].present?
        date_from = Date.iso8601(@params[:date_from])

        trips = trips.where(
          'fishing_trips.started_at >= ?',
          date_from.in_time_zone.beginning_of_day
        )
      end

      if @params[:date_to].present?
        date_to = Date.iso8601(@params[:date_to])

        trips = trips.where(
          'fishing_trips.started_at <= ?',
          date_to.in_time_zone.end_of_day
        )
      end

      trips
    end

    def sort(trips)
      case @params[:sort_by]
      when 'oldest'
        trips.order(started_at: :asc, id: :asc)
      when 'most_catches'
        trips.left_joins(:catches)
             .group('fishing_trips.id')
             .order(
               Arel.sql(
                 'COUNT(catches.id) DESC, fishing_trips.started_at DESC'
               )
             )
      when 'fewest_catches'
        trips.left_joins(:catches)
             .group('fishing_trips.id')
             .order(
               Arel.sql(
                 'COUNT(catches.id) ASC, fishing_trips.started_at DESC'
               )
             )
      when 'heaviest'
        trips.left_joins(:catches)
             .group('fishing_trips.id')
             .order(
               Arel.sql(
                 'COALESCE(SUM(catches.weight), 0) DESC, fishing_trips.started_at DESC'
               )
             )
      when 'lightest'
        trips.left_joins(:catches)
             .group('fishing_trips.id')
             .order(
               Arel.sql(
                 'COALESCE(SUM(catches.weight), 0) ASC, fishing_trips.started_at DESC'
               )
             )
      else
        trips.order(started_at: :desc, id: :desc)
      end
    end
  end
end
