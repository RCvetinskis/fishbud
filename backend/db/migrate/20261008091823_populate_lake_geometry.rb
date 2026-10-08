class PopulateLakeGeometry < ActiveRecord::Migration[7.0]
  def up
    execute <<~SQL
      UPDATE lakes
      SET geometry = ST_GeomFromText(shape, 3346)
      WHERE shape IS NOT NULL
    SQL
  end

  def down
    execute <<~SQL
      UPDATE lakes
      SET geometry = NULL
    SQL
  end
end
