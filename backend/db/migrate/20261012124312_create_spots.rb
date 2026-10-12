class CreateSpots < ActiveRecord::Migration[7.0]
  def change
    create_table :spots do |t|
      t.references :user, null: false, foreign_key: true
      t.references :lake, null: false, foreign_key: true

      t.string :name, null: false
      t.text :description
      t.decimal :latitude, precision: 10, scale: 7, null: false
      t.decimal :longitude, precision: 10, scale: 7, null: false

      t.timestamps
    end
  end
end
