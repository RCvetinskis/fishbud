class CreateWeathers < ActiveRecord::Migration[7.0]
  def change
    create_table :weathers do |t|
      t.references :catch, null: false, foreign_key: true, index: { unique: true }

      t.decimal :temperature, precision: 5, scale: 2
      t.decimal :feels_like, precision: 5, scale: 2
      t.integer :humidity
      t.decimal :precipitation, precision: 7, scale: 2
      t.decimal :rain, precision: 7, scale: 2
      t.integer :precipitation_probability
      t.integer :cloud_cover
      t.decimal :wind_speed, precision: 6, scale: 2
      t.integer :wind_direction
      t.decimal :wind_gusts, precision: 6, scale: 2
      t.decimal :pressure, precision: 7, scale: 2
      t.integer :weather_code
      t.datetime :observed_at, null: false
      t.string :source, default: 'open_meteo', null: false

      t.timestamps
    end
  end
end
