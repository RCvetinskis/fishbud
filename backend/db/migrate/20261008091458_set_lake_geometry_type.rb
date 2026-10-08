class SetLakeGeometryType < ActiveRecord::Migration[7.0]
  def up
    execute <<~SQL
      ALTER TABLE lakes
      ALTER COLUMN geometry
      TYPE geometry(MultiPolygon, 3346)
      USING geometry
    SQL
  end

  def down
    execute <<~SQL
      ALTER TABLE lakes
      ALTER COLUMN geometry
      TYPE geometry
      USING geometry
    SQL
  end
end
