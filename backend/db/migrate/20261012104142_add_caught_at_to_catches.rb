class AddCaughtAtToCatches < ActiveRecord::Migration[7.0]
  def change
    add_column :catches, :caught_at, :datetime
  end
end
