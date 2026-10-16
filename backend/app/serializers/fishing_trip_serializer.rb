class FishingTripSerializer < ActiveModel::Serializer
  attributes :id,
             :lake_name,
             :started_at,
             :ended_at,
             :status,
             :catches

  def lake_name
    object.lake.name
  end

  def catches
    object.catches.map do |catch|
      {
        id: catch.id,
        fish_name: catch.fish.name,
        caught_at: catch.caught_at,
        weight: catch.weight,
        length: catch.length,
        lure: catch&.lure,
        weather: weather_attributes(catch)
      }
    end
  end

  private

  def weather_attributes(catch)
    weather = catch.weather
    return unless weather

    {
      temperature: weather.temperature,
      wind_speed: weather.wind_speed,
      wind_direction: weather.wind_direction_compass,
      pressure: weather.pressure
    }
  end
end
