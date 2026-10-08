# CALL THIS SERVICE IN PRODUCTION TO FETCH LAKES
module Lakes
  class Fetch
    def self.call
      return Lake.all if Lake.exists?

      Lakes::Import.call

      Lake.all
    end
  end
end
