class WeatherService
  include HTTParty
  base_uri "https://api.openweathermap.org/data/2.5"

  format   :json
  headers "Content_type" => "application/json"

  def self.fetch_weather_by(zip:, city:)
    response = get("/weather?q=#{city}&zip=#{zip}&units=imperial&appid=#{ENV['OPENWEATHERMAP_API_KEY']}")
    JSON.parse(response.body)
  end
end
