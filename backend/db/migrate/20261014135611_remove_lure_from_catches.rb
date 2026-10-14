class RemoveLureFromCatches < ActiveRecord::Migration[7.0]
  def change
    remove_column :catches, :lure, :string
  end
end
