class AddWeightAndLengthToCatches < ActiveRecord::Migration[7.0]
  def change
    add_column :catches, :weight, :decimal, precision: 8, scale: 2
    add_column :catches, :length, :decimal, precision: 6, scale: 2
  end
end
