module Statistics
  class LureSerializer < ActiveModel::Serializer
    attributes :id, :name, :total_catches, :most_common_fish, :most_common_weather, :description

    def total_catches
      catches.count
    end

    def most_common_fish
      catches
        .joins(:fish)
        .group('fish.id', 'fish.name')
        .order(Arel.sql('COUNT(catches.id) DESC'))
        .limit(1)
        .pluck(
          'fish.id',
          'fish.name',
          Arel.sql('COUNT(catches.id)')
        )
        .map do |id, name, count|
          {
            id: id,
            name: name,
            catches_count: count
          }
        end
        .first
    end

    def most_common_weather
      Weather.most_common_by_catches(catches)
    end

    private

    def catches
      @catches ||= object.catches
    end
  end
end
