module Statistics
  class BaseService
    PERIODS = {
      '7d' => 7.days,
      '30d' => 30.days,
      '90d' => 90.days,
      'all' => nil
    }.freeze
    DEFAULT_PERIOD = '7d'.freeze
    DEFAULT_FISH = 'all'.freeze

    LIMIT = 25

    def initialize(period: DEFAULT_PERIOD, selected_fish: DEFAULT_FISH,
                   current_user: nil, page: nil, selected_lure: nil, sort_params: nil)
      @period        = PERIODS.key?(period) ? period : DEFAULT_PERIOD
      @selected_fish = normalize_fish(selected_fish)
      @current_user  = current_user
      @page          = page
      @selected_lure = selected_lure
      @sort_params   = sort_params
    end

    private

    attr_reader :period, :selected_fish, :current_user, :page, :selected_lure, :sort_params

    def normalize_fish(value)
      value.presence || DEFAULT_FISH
    end

    def filter_by_period(relation, column:)
      return relation if @period == 'all'

      start_date = PERIODS.fetch(@period).ago

      relation.where(
        "#{column} BETWEEN ? AND ?",
        start_date,
        Time.current
      )
    end

    def pagination_dict(collection)
      {
        current_page: collection.current_page,
        total_pages: collection.total_pages,
        total_count: collection.total_count,
        per_page: collection.limit_value
      }
    end
  end
end
