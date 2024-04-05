class WeatherController < ApplicationController
  def show
    render :show
  end

  def get_weather
    @weather = WeatherService.fetch_weather_by(latitude:  weather_params[:latitude],
                                               longitude: weather_params[:longitude],
                                               city:      weather_params[:city],
                                               zip:       weather_params[:zip_code])

    render json: @weather
  end

  def get_forecast
    @forecast = WeatherService.fetch_forecast_by(latitude:  weather_params[:latitude],
                                                 longitude: weather_params[:longitude],
                                                 city:      weather_params[:city],
                                                 zip:       weather_params[:zip_code],
                                                 count:     weather_params[:count])
    render json: @forecast
  end

  private

  def weather_params
    params.permit(:latitude, :longitude, :city, :zip_code, :count)
  end
end
