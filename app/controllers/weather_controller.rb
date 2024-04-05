class WeatherController < ApplicationController
  def show
    render :show
  end

  def get_weather
    city     = params[:city]
    zip_code = params[:zip_code]
    @weather_data = WeatherService.fetch_weather_by(city: city, zip: zip_code)

    render json: @weather_data
  end

  private

  def weather_params
    params.permit(:city, :zip_code)
  end
end
