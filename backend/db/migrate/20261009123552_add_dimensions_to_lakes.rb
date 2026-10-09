class AddDimensionsToLakes < ActiveRecord::Migration[7.0]
  def change
    add_column :lakes, :length, :decimal, precision: 12, scale: 6
    add_column :lakes, :width, :decimal, precision: 12, scale: 6
    add_column :lakes, :shoreline_length, :decimal, precision: 12, scale: 6
  end
end
