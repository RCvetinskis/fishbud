class CatchSerializer < ActiveModel::Serializer
  attributes :id, :fish_name, :caught_by, :lure, :description, :created_at, :updated_at, :fish_id, :lake_id, :user_id

  def fish_name
    object.fish.name.capitalize
  end

  def caught_by
    object.user.username.capitalize
  end

  def created_at
    I18n.l(object.created_at, format: '%Y-%m-%d %H:%M')
  end

  def updated_at
    I18n.l(object.updated_at, format: '%Y-%m-%d %H:%M')
  end
end
