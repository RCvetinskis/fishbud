class AddLureToCatches < ActiveRecord::Migration[7.0]
  def change
    add_reference :catches, :lure, foreign_key: true, null: true
  end
end
