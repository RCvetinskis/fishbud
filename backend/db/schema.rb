# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 20_261_014_135_611) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'
  enable_extension 'postgis'
  enable_extension 'unaccent'

  create_table 'active_storage_attachments', force: :cascade do |t|
    t.string 'name', null: false
    t.string 'record_type', null: false
    t.bigint 'record_id', null: false
    t.bigint 'blob_id', null: false
    t.datetime 'created_at', null: false
    t.index ['blob_id'], name: 'index_active_storage_attachments_on_blob_id'
    t.index %w[record_type record_id name blob_id], name: 'index_active_storage_attachments_uniqueness',
                                                    unique: true
  end

  create_table 'active_storage_blobs', force: :cascade do |t|
    t.string 'key', null: false
    t.string 'filename', null: false
    t.string 'content_type'
    t.text 'metadata'
    t.string 'service_name', null: false
    t.bigint 'byte_size', null: false
    t.string 'checksum'
    t.datetime 'created_at', null: false
    t.index ['key'], name: 'index_active_storage_blobs_on_key', unique: true
  end

  create_table 'active_storage_variant_records', force: :cascade do |t|
    t.bigint 'blob_id', null: false
    t.string 'variation_digest', null: false
    t.index %w[blob_id variation_digest], name: 'index_active_storage_variant_records_uniqueness', unique: true
  end

  create_table 'catches', force: :cascade do |t|
    t.bigint 'fish_id', null: false
    t.bigint 'user_id', null: false
    t.bigint 'lake_id', null: false
    t.text 'description'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.decimal 'weight', precision: 8, scale: 2
    t.decimal 'length', precision: 6, scale: 2
    t.bigint 'fishing_trip_id'
    t.datetime 'caught_at'
    t.bigint 'lure_id'
    t.index ['fish_id'], name: 'index_catches_on_fish_id'
    t.index ['fishing_trip_id'], name: 'index_catches_on_fishing_trip_id'
    t.index ['lake_id'], name: 'index_catches_on_lake_id'
    t.index ['lure_id'], name: 'index_catches_on_lure_id'
    t.index %w[user_id created_at], name: 'index_catches_on_user_id_and_created_at'
    t.index ['user_id'], name: 'index_catches_on_user_id'
  end

  create_table 'fish', force: :cascade do |t|
    t.string 'name', null: false
    t.string 'image_url'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'fishing_trips', force: :cascade do |t|
    t.bigint 'user_id', null: false
    t.bigint 'lake_id', null: false
    t.datetime 'started_at', null: false
    t.datetime 'ended_at'
    t.text 'notes'
    t.string 'status', default: 'in_progress', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['lake_id'], name: 'index_fishing_trips_on_lake_id'
    t.index ['user_id'], name: 'index_fishing_trips_on_user_id'
  end

  create_table 'lakes', force: :cascade do |t|
    t.string 'name'
    t.decimal 'area'
    t.decimal 'latitude'
    t.decimal 'longitude'
    t.text 'shape'
    t.string 'external_id'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.geometry 'geometry', limit: { srid: 3346, type: 'multi_polygon' }
    t.decimal 'length', precision: 12, scale: 6
    t.decimal 'width', precision: 12, scale: 6
    t.decimal 'shoreline_length', precision: 12, scale: 6
    t.index ['geometry'], name: 'index_lakes_on_geometry', using: :gist
  end

  create_table 'lures', force: :cascade do |t|
    t.string 'name', null: false
    t.string 'lure_type'
    t.text 'description'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
  end

  create_table 'refresh_tokens', force: :cascade do |t|
    t.bigint 'user_id', null: false
    t.string 'token_digest', null: false
    t.datetime 'expires_at', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['token_digest'], name: 'index_refresh_tokens_on_token_digest', unique: true
    t.index ['user_id'], name: 'index_refresh_tokens_on_user_id'
  end

  create_table 'spots', force: :cascade do |t|
    t.bigint 'user_id', null: false
    t.bigint 'lake_id', null: false
    t.string 'name', null: false
    t.text 'description'
    t.decimal 'latitude', precision: 10, scale: 7, null: false
    t.decimal 'longitude', precision: 10, scale: 7, null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['lake_id'], name: 'index_spots_on_lake_id'
    t.index ['user_id'], name: 'index_spots_on_user_id'
  end

  create_table 'users', force: :cascade do |t|
    t.string 'email', default: '', null: false
    t.string 'encrypted_password', default: '', null: false
    t.string 'reset_password_token'
    t.datetime 'reset_password_sent_at'
    t.datetime 'remember_created_at'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'jti', null: false
    t.string 'username', null: false
    t.index ['email'], name: 'index_users_on_email', unique: true
    t.index ['jti'], name: 'index_users_on_jti', unique: true
    t.index ['reset_password_token'], name: 'index_users_on_reset_password_token', unique: true
    t.index ['username'], name: 'index_users_on_username', unique: true
  end

  create_table 'weathers', force: :cascade do |t|
    t.bigint 'catch_id', null: false
    t.decimal 'temperature', precision: 5, scale: 2
    t.decimal 'feels_like', precision: 5, scale: 2
    t.integer 'humidity'
    t.decimal 'precipitation', precision: 7, scale: 2
    t.decimal 'rain', precision: 7, scale: 2
    t.integer 'precipitation_probability'
    t.integer 'cloud_cover'
    t.decimal 'wind_speed', precision: 6, scale: 2
    t.integer 'wind_direction'
    t.decimal 'wind_gusts', precision: 6, scale: 2
    t.decimal 'pressure', precision: 7, scale: 2
    t.integer 'weather_code'
    t.datetime 'observed_at', null: false
    t.string 'source', default: 'open_meteo', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.index ['catch_id'], name: 'index_weathers_on_catch_id', unique: true
  end

  add_foreign_key 'active_storage_attachments', 'active_storage_blobs', column: 'blob_id'
  add_foreign_key 'active_storage_variant_records', 'active_storage_blobs', column: 'blob_id'
  add_foreign_key 'catches', 'fish'
  add_foreign_key 'catches', 'fishing_trips'
  add_foreign_key 'catches', 'lakes'
  add_foreign_key 'catches', 'lures'
  add_foreign_key 'catches', 'users'
  add_foreign_key 'fishing_trips', 'lakes'
  add_foreign_key 'fishing_trips', 'users'
  add_foreign_key 'refresh_tokens', 'users'
  add_foreign_key 'spots', 'lakes'
  add_foreign_key 'spots', 'users'
  add_foreign_key 'weathers', 'catches'
end
