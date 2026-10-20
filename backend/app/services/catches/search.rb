module Catches
  class Search
    def self.call(scope:, params:)
      new(scope, params).call
    end

    def initialize(scope, params)
      @catches = scope
      @params = params
    end

    def call
      catches = filter_by_fish(@catches)
      catches = filter_by_date(catches)

      sort(catches)
    end

    private

    def filter_by_fish(catches)
      return catches unless @params[:fish_id].present?

      catches.where(fish_id: @params[:fish_id])
    end

    def filter_by_date(catches)
      if @params[:date_from].present?
        catches = catches.where(
          'created_at >= ?',
          Date.iso8601(@params[:date_from]).beginning_of_day
        )
      end

      if @params[:date_to].present?
        catches = catches.where(
          'created_at <= ?',
          Date.iso8601(@params[:date_to]).end_of_day
        )
      end

      catches
    end

    def sort(catches)
      case @params[:sort_by]
      when 'oldest'
        catches.order(created_at: :asc)
      when 'heaviest'
        catches.heaviest_first
      when 'lightest'
        catches.order(Arel.sql('weight ASC NULLS LAST'))
      when 'longest'
        catches.longest_first
      when 'shortest'
        catches.order(Arel.sql('length ASC NULLS LAST'))
      else
        catches.order(created_at: :desc)
      end
    end
  end
end
