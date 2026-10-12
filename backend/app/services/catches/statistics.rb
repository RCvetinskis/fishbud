module Catches
  class Statistics
    def self.call(lake_id: nil, user_id: nil)
      catches = Catch.all
      catches = catches.where(lake_id: lake_id) if lake_id
      catches = catches.where(user_id: user_id) if user_id

      days = catches
             .select(<<~SQL.squish)
               DATE(COALESCE(caught_at, created_at)) AS catch_date,
               COUNT(*) AS catches_count,
               MAX(weight) AS heaviest_weight,
               MAX(length) AS longest_length,
               SUM(weight) AS total_weight
             SQL
             .group('DATE(COALESCE(caught_at, created_at))')
             .to_a

      most_common_fish = catches
                         .joins(:fish)
                         .select(
                           'fish.id AS fish_id',
                           'fish.name AS fish_name',
                           'COUNT(catches.id) AS catches_count'
                         )
                         .group('fish.id', 'fish.name')
                         .order(Arel.sql('COUNT(catches.id) DESC'))
                         .first

      {
        total_catches: catches.count,
        most_catches: days.max_by { |day| day.catches_count.to_i },
        heaviest_fish: days.select { |day| day.heaviest_weight.present? }
                           .max_by(&:heaviest_weight),
        longest_fish: days.select { |day| day.longest_length.present? }
                          .max_by(&:longest_length),
        highest_total_weight: days.select { |day| day.total_weight.present? }
                                  .max_by(&:total_weight),
        most_common_fish: most_common_fish && {
          fish_id: most_common_fish.fish_id,
          fish_name: most_common_fish.fish_name,
          catches_count: most_common_fish.catches_count.to_i
        }
      }
    end
  end
end
