class CreateFish < ActiveRecord::Migration[7.0]
  def change
    create_table :fish do |t|
      t.string :name, null: false
      t.string :image_url
      t.timestamps
    end
  end
end
