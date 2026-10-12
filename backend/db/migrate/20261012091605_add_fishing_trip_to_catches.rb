class AddUniqueActiveFishingTripPerUser < ActiveRecord::Migration[7.0]
  def change
    add_index :fishing_trips,
              :user_id,
              unique: true,
              where: "status = 'in_progress'",
              name: 'index_one_active_fishing_trip_per_user'
  end
end
