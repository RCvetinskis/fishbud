class CreateCatches < ActiveRecord::Migration[7.0]
  def change
    create_table :catches do |t|
      t.references :fish, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.references :lake, null: false, foreign_key: true
      t.text :description
      t.string :lure

      t.timestamps
    end
    add_index :catches, %i[user_id created_at]
  end
end
