class FishingTripsController < ApplicationController
  before_action :set_lake, only: %i[lake_fishing_trips]
  before_action :authenticate_user!, only: %i[create update active]

  def lake_fishing_trips
    return render_not_found unless @lake

    fishing_trips = FishingTrips::Search.call(
      lake: @lake,
      params: params,
      per_page: per_page
    )

    render_success(
      {
        result: serialize_collection(fishing_trips, FishingTripSerializer),
        meta: pagination_dict(fishing_trips)
      }
    )
  rescue Date::Error
    render_error('Invalid date filter. Use YYYY-MM-DD.')
  end

  def active
    trip = current_user.fishing_trips
                       .where(status: 'in_progress')
                       .order(started_at: :desc)
                       .first

    render_success(trip)
  end

  def create
    trip = current_user.fishing_trips.new(
      lake_id: params.require(:lake_id),
      started_at: Time.current,
      status: :in_progress
    )

    if trip.save
      render_created(trip)
    else

      render_error(trip.errors.full_messages.first)

    end
  end

  def update
    trip = current_user.fishing_trips.find(params[:id])

    unless trip.in_progress?
      return render json: { error: 'Trip is already completed' },
                    status: :unprocessable_entity
    end

    return render_error('Invalid status transition') if params[:status] != 'completed'

    if trip.update(status: :completed, ended_at: Time.current)
      render_updated(trip)
    else
      render_error(trip.errors.full_messages.first)
    end
  end

  private

  def set_lake
    @lake = Lake.find_by(id: params[:lake_id])
  end
end
