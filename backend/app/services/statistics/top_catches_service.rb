module Statistics
  class TopCatchesService < BaseService
    def call
      top_catches(filtered_catches)
    end

    private

    def filtered_catches
      filter_by_period(
        Catch.all,
        column: 'COALESCE(catches.caught_at, catches.created_at)'
      )
    end

    def top_catches(catches)
      catches
        .includes(:lake, :fish, :user, image_attachment: :blob)
        .where.not(length: nil, weight: nil)
        .order(length: :desc, weight: :desc, created_at: :desc)
        .limit(LIMIT)
        .map do |catch|
          {
            id: catch.id,
            fish: catch.fish&.name,
            username: catch.user&.username,
            length: catch.length,
            weight: catch.weight,
            lake_name: catch.lake.name,
            lake_id: catch.lake.id,
            date: (catch.caught_at || catch.created_at)&.to_date,
            image_url: if catch.image.attached?
                         Rails.application.routes.url_helpers.rails_blob_url(
                           catch.image,
                           host: ENV.fetch('APP_HOST', 'http://localhost:3001')
                         )
                       end
          }
        end
    end
  end
end
