module Statistics
  class TopCatchesService < BaseService
    def call
      top_catches(filtered_catches)
    end

    private

    def filtered_catches
      scope = filter_by_period(
        Catch.all,
        column: 'COALESCE(catches.caught_at, catches.created_at)'
      )
      scope = scope.where(fish_id: selected_fish) if selected_fish != 'all'
      scope = scope.where(user_id: current_user.id) if current_user
      scope
    end

    def top_catches(catches)
      scope = catches
              .includes(:lake, :fish, :user, image_attachment: :blob)
              .where.not(length: nil, weight: nil)
              .order(length: :desc, weight: :desc, created_at: :desc, id: :desc)

      paginated = scope.page(page).per(LIMIT)
      {
        items: paginated.map { |catch| serialize(catch) },
        pagination: pagination_dict(paginated)
      }
    end

    def serialize(catch)
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
