module Search
  class SuggestionsService
    DEFAULT_LIMIT = 5
    MAX_LIMIT     = 20

    def self.call(scope:, query:, limit: DEFAULT_LIMIT, column: :name)
      ranked = RankedScopeService.call(
        scope: scope,
        query: query,
        limit: normalize_limit(limit),
        column: column
      )

      ranked.select(:id, :name).map { |r| { id: r.id, name: r.name } }
    end

    def self.normalize_limit(value)
      value = value.to_i
      value = DEFAULT_LIMIT if value <= 0
      value.clamp(1, MAX_LIMIT)
    end
    private_class_method :normalize_limit
  end
end
