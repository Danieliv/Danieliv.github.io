class WeatherService
  include HTTParty
  base_uri "https://api.openweathermap.org/data/2.5"

  format   :json
  headers "Content_type" => "application/json"

  def self.fetch_weather_by(latitude:, longitude:, city:, zip:)
    response = get("/weather?lat=#{latitude}&lon=#{longitude}&q=#{city}&zip=#{zip}&units=imperial&appid=#{ENV['OPENWEATHERMAP_API_KEY']}")
    JSON.parse(response.body)
  end

  def self.fetch_forecast_by(latitude:, longitude:, city:, zip:, count:)
    response = get("/forecast?lat=#{latitude}&lon=#{longitude}&q=#{city}&zip=#{zip}&cnt=#{count}&units=imperial&appid=#{ENV['OPENWEATHERMAP_API_KEY']}")
    JSON.parse(response.body)
  end
end
