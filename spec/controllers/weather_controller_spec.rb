require 'rails_helper'

RSpec.describe WeatherController, type: :controller do
  describe 'GET #show' do
    it 'renders the show template' do
      get :show
      expect(response).to render_template(:show)
    end
  end

  describe 'GET #get_weather' do
    it 'returns weather data for a city' do
      allow(WeatherService).to receive(:fetch_weather_by).and_return({ temperature: 25, condition: 'sunny' })

      get :get_weather, params: { city: 'New York' }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq({ 'temperature' => 25, 'condition' => 'sunny' })
    end

    it 'returns weather data for a zip code' do
      allow(WeatherService).to receive(:fetch_weather_by).and_return({ temperature: 20, condition: 'cloudy' })

      get :get_weather, params: { zip_code: '10001' }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq({ 'temperature' => 20, 'condition' => 'cloudy' })
    end
  end
end
