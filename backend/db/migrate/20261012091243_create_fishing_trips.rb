class CreateFishingTrips < ActiveRecord::Migration[7.0]
  def change
    create_table :fishing_trips do |t|
      t.references :user, null: false, foreign_key: true
      t.references :lake, null: false, foreign_key: true

      t.datetime :started_at, null: false
      t.datetime :ended_at
      t.text :notes

      t.string :status, null: false, default: 'in_progress'

      t.timestamps
    end
  end
end
