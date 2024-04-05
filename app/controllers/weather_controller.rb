class WeatherController < ApplicationController
  def show
    render :show
  end

  def get_weather
    @weather_data = WeatherService.fetch_weather_by(latitude:  params[:latitude],
                                                    longitude: params[:longitude],
                                                    city:      params[:city],
                                                    zip:       params[:zip_code])

    render json: @weather_data
  end

  private

  def weather_params
    params.permit(:latitude, :longitude, :city, :zip_code)
  end
end
