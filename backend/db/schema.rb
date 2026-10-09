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

ActiveRecord::Schema[7.0].define(version: 2026_10_09_140524) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "catches", force: :cascade do |t|
    t.bigint "fish_id", null: false
    t.bigint "user_id", null: false
    t.bigint "lake_id", null: false
    t.text "description"
    t.string "lure"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fish_id"], name: "index_catches_on_fish_id"
    t.index ["lake_id"], name: "index_catches_on_lake_id"
    t.index ["user_id", "created_at"], name: "index_catches_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_catches_on_user_id"
  end

  create_table "fish", force: :cascade do |t|
    t.string "name", null: false
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lakes", force: :cascade do |t|
    t.string "name"
    t.decimal "area"
    t.decimal "latitude"
    t.decimal "longitude"
    t.text "shape"
    t.string "external_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.geometry "geometry", limit: {:srid=>3346, :type=>"multi_polygon"}
    t.decimal "length", precision: 12, scale: 6
    t.decimal "width", precision: 12, scale: 6
    t.decimal "shoreline_length", precision: 12, scale: 6
    t.index ["geometry"], name: "index_lakes_on_geometry", using: :gist
  end

  create_table "refresh_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token_digest", null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token_digest"], name: "index_refresh_tokens_on_token_digest", unique: true
    t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.string "username", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "catches", "fish"
  add_foreign_key "catches", "lakes"
  add_foreign_key "catches", "users"
  add_foreign_key "refresh_tokens", "users"
end
