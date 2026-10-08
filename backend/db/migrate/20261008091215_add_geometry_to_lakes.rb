class AddGeometryToLakes < ActiveRecord::Migration[7.0]
  def change
    add_column :lakes, :geometry, :geometry, srid: 3346
    add_index :lakes, :geometry, using: :gist
  end
end
