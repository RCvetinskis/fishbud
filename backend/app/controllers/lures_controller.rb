class LuresController < ApplicationController
  def index
    top_lures = Lure.top_10_lures.to_a
    top_lure_ids = top_lures.map(&:id)

    remaining_lures = Lure.where.not(id: top_lure_ids)
                          .order(created_at: :desc)

    render_success(top_lures + remaining_lures.to_a)
  end

  def create
    lure = Lure.new(lure_params)
    if lure.save
      render_created(lure)
    else
      render_error(lure.errors.full_messages.first)
    end
  end

  def lure_types
    render_success(Lure::LURE_TYPES)
  end

  private

  def lure_params
    params.require(:lure).permit(:name, :description, :lure_type)
  end
end
