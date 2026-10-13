module Search
  class RankedScopeService
    ALLOWED_COLUMNS = %i[name].freeze
    DEFAULT_LIMIT   = 50

    def self.call(scope:, query:, limit: DEFAULT_LIMIT, column: :name)
      new(scope, query, limit, column).call
    end

    def initialize(scope, query, limit, column)
      raise ArgumentError, 'column not allowed' unless ALLOWED_COLUMNS.include?(column)

      @scope  = scope
      @query  = query.to_s.strip
      @limit  = limit
      @column = column
    end

    def call
      return @scope.none if @query.blank?

      klass  = @scope.klass
      quoted = klass.connection.quote(@query)
      prefix = klass.connection.quote("#{@query}%")
      like   = "%#{ActiveRecord::Base.sanitize_sql_like(@query)}%"
      col    = @column.to_s

      @scope
        .where.not(col => [nil, ''])
        .where("unaccent(#{col}) ILIKE unaccent(?)", like)
        .order(Arel.sql(<<~SQL.squish))
          CASE
            WHEN unaccent(#{col}) ILIKE unaccent(#{quoted}) THEN 0
            WHEN unaccent(#{col}) ILIKE unaccent(#{prefix}) THEN 1
            ELSE 2
          END
        SQL
        .order(Arel.sql("length(#{col})"))
        .order(@column)
        .limit(@limit)
    end
  end
end
