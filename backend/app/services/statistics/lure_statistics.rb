module Statistics
  class LureStatistics < BaseService
    SORT_COLUMNS = {
      'catches_count' => Arel.sql('COUNT(*)'),
      'lure' => 'lures.name',
      'fish_name' => 'fish.name'
    }.freeze

    DEFAULT_SORT = 'catches_count'.freeze
    DEFAULT_DIRECTION = 'desc'.freeze

    def call
      {
        items: result,
        summary: summary,
        pagination: pagination
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
      scope = scope.where(lure_id: selected_lure) if selected_lure != 'all'

      scope
    end

    def grouped_relation
      filtered_catches
        .joins(:lure, :fish)
        .group('lures.id', 'lures.name', 'fish.name')
    end

    def sorted_relation
      params = sort_params || {}

      column = params[:column].presence ||
               params['column'].presence ||
               params[:sort_by].presence ||
               params['sort_by'].presence ||
               DEFAULT_SORT

      direction = params[:direction].presence ||
                  params['direction'].presence ||
                  DEFAULT_DIRECTION

      column = column.to_s
      direction = direction.to_s.downcase

      column = DEFAULT_SORT unless SORT_COLUMNS.key?(column)
      direction = 'desc' unless %w[asc desc].include?(direction)

      grouped_relation.order(
        SORT_COLUMNS.fetch(column) => direction
      )
    end

    def summary
      catches = filtered_catches

      {
        recorded_catches: catches.count,
        unique_lures: catches.joins(:lure).distinct.count('lures.name'),
        unique_fish: catches.joins(:fish).distinct.count('fish.id')
      }
    end

    def result
      sorted_relation
        .limit(LIMIT)
        .offset((page.to_i - 1) * LIMIT)
        .pluck(
          'lures.name',
          'fish.name',
          'lures.id',
          Arel.sql('COUNT(*)')
        )
        .map do |lure, fish_name, lure_id, count|
          {
            lure: lure,
            fish_name: fish_name,
            lure_id: lure_id,
            catches_count: count.to_i
          }
        end
    end

    def pagination
      total_count = grouped_relation.count.size

      {
        current_page: page.to_i,
        total_pages: (total_count.to_f / LIMIT).ceil,
        total_count: total_count,
        per_page: LIMIT
      }
    end
  end
end
