class LakeSerializer < ActiveModel::Serializer
  attributes :id, :name, :area, :length, :width, :shoreline_length,
             :latitude, :longitude

  def shoreline_length
    object.shoreline_length&.round(2)
  end

  def length
    object.length&.round(2)
  end

  def width
    object.width&.round(2)
  end
end
