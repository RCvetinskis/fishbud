require 'csv'
# CVC file with data can be found: https://www.fishbase.se/ComNames/CommonNameSearchList.php
task load_fish: :environment do
  file_path = Rails.root.join('db', 'seeds', 'lt_fishes.csv')

  CSV.foreach(file_path, headers: true) do |row|
    common_name = row['Common Name']&.strip
    pictures = row['Pictures']&.strip

    next if common_name.blank?

    image_url = pictures&.match(/HYPERLINK\("([^"]+)"/)&.captures&.first

    Fish.create!(
      name: common_name,
      image_url: image_url
    )
  end

  puts 'Fish loaded succesfully!'
end
