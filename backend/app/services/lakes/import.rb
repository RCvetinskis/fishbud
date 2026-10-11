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
        lake.length = data['ilgis']
        lake.width = data['plotis']
        lake.shoreline_length = data['linijos_ilgis']

        lake.latitude, lake.longitude = parse_point(data['koord']) if data['koord'].present?

        lake.shape = data['shape']
        lake.save!
      end
    end

    def self.parse_point(point)
      northing, easting = point
                          .sub(/^POINT\s*\(/i, '')
                          .sub(/\)$/, '')
                          .split
                          .map(&:to_f)

      sql = Lake.sanitize_sql_array([
                                      <<~SQL,
                                        SELECT
                                          ST_Y(coords) AS latitude,
                                          ST_X(coords) AS longitude
                                        FROM (
                                          SELECT ST_Transform(
                                            ST_SetSRID(ST_MakePoint(?, ?), 3346),
                                            4326
                                          ) AS coords
                                        ) transformed
                                      SQL
                                      easting,
                                      northing
                                    ])

      result = Lake.connection.select_one(sql)

      [result['latitude'].to_f, result['longitude'].to_f]
    end

    private_class_method :save_lake, :parse_point
  end
end
