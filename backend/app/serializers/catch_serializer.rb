class CatchSerializer < ActiveModel::Serializer
  attributes :id, :fish_name, :caught_by, :lure, :description, :created_at, :updated_at, :fish_id, :lake_id, :user_id,
             :weight, :length, :image_url, :weather, :caught_at

  def fish_name
    object.fish.name.capitalize
  end

  def caught_by
    object.user.username.capitalize
  end

  def caught_at
    time = object.caught_at || object.created_at
    I18n.l(time, format: '%Y-%m-%d %H:%M')
  end

  def created_at
    I18n.l(object.created_at, format: '%Y-%m-%d %H:%M')
  end

  def updated_at
    I18n.l(object.updated_at, format: '%Y-%m-%d %H:%M')
  end

  def image_url
    return unless object.image.attached?

    Rails.application.routes.url_helpers.rails_blob_url(
      object.image,
      host: ENV.fetch('APP_HOST', 'http://localhost:3001')
    )
  end

  def weather
    record = object.weather

    return unless record

    {
      temperature: record.temperature,
      wind_speed: record.wind_speed,
      wind_direction: record.wind_direction_compass,
      pressure: record.pressure
    }
  end

  def lure
    return unless object.lure

    {
      name: object.lure.name,
      description: object.lure.description,
      lure_type: object.lure.lure_type
    }
  end
end
