module Statistics
  class BaseService
    PERIODS = {
      '7d' => 7.days,
      '30d' => 30.days,
      '90d' => 90.days,
      'all' => nil
    }.freeze
    LIMIT = 25

    def initialize(period: '7d')
      @period = PERIODS.key?(period) ? period : '7d'
    end

    private

    def filter_by_period(relation, column:)
      return relation if @period == 'all'

      start_date = PERIODS.fetch(@period).ago

      relation.where(
        "#{column} BETWEEN ? AND ?",
        start_date,
        Time.current
      )
    end
  end
end
