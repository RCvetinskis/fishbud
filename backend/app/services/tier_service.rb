module TierService
  module_function

  # [max_features, tolerance_meters]
  # max_features nil → no LIMIT (zoomed in enough that viewport is small)
  def for_lakes(zoom)
    case zoom
    when 1..6   then [0,    400]
    when 7..8   then [50,   150]
    when 9..10  then [150,  50]
    when 11..12 then [500,  15]
    when 13     then [1000, 5]
    when 14..15 then [2000, 1]
    else             [nil,  0]
    end
  end

  # max_features nil → no LIMIT
  def for_spots(zoom)
    case zoom
    when 1..6   then 0
    when 7..8   then 100
    when 9..10  then 300
    when 11..12 then 1000
    when 13     then 2000
    end
  end
end
