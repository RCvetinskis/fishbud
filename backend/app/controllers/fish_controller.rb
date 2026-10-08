class FishController < ApplicationController
  def index
    render_success(Fish.all)
  end
end
