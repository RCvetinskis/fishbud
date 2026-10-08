class CreateLakes < ActiveRecord::Migration[7.0]
  def change
    create_table :lakes do |t|
      t.string :name
      t.decimal :area
      t.decimal :latitude
      t.decimal :longitude
      t.text :shape
      t.string :external_id

      t.timestamps
    end
  end
end
