module Lakes
  class Import
    API_URL = 'https://get.data.gov.lt/datasets/gov/aaa/ezerai_tvenkiniai/EzerasTvenkinys/:format/json'.freeze

    def self.call
      response = Faraday.get(API_URL)

      raise "Failed to fetch lakes: #{response.status}" unless response.success?

      data = JSON.parse(response.body)

      data.fetch('_data').each do |lake|
        save_lake(lake)
      end
    end

    def self.save_lake(data)
      Lake.find_or_initialize_by(external_id: data['_id']).tap do |lake|
        lake.name = data['pavadinimas']
        lake.area = data['pav_plotas']

        if data['koord'].present?
          latitude, longitude = parse_point(data['koord'])

          lake.latitude = latitude
          lake.longitude = longitude
        end

        lake.shape = data['shape']

        lake.save!
      end
    end

    def self.parse_point(point)
      coordinates = point
                    .sub(/^POINT\s*\(/i, '')
                    .sub(/\)$/, '')
                    .split
                    .map(&:to_f)

      x, y = coordinates

      [x, y]
    end

    private_class_method :save_lake, :parse_point
  end
end
