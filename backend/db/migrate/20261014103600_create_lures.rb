class CreateLures < ActiveRecord::Migration[7.0]
  def change
    create_table :lures do |t|
      t.string :name, null: false
      t.string :lure_type
      t.text :description

      t.timestamps
    end
  end
end
