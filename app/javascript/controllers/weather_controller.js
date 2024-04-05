import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["inputLocation", "city", "currentLocation", "currentTemperature", "currentDescription", "currentIcon"];

  async getWeather(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }

  async getWeatherByInputLocation() {
    const inputLocation = this.inputLocationTarget.value.trim();

    // Regular expressions to match zipcode and city
    const cityPattern    = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
    const zipcodePattern = /^\d{5}(?:[-\s]\d{4})?$/

    if (cityPattern.test(inputLocation)) {
      const data = await this.getWeather(`/get_weather?city=${inputLocation}`);
      this.updateWeather(data);
    }
    else if (zipcodePattern.test(inputLocation)) {
      const data = await this.getWeather(`/get_weather?zip_code=${inputLocation}`);
      this.updateWeather(data);
    }
    else {
      console.log("Input is neither a zipcode nor a city")
    }
  }

  updateWeather(data) {
    this.currentLocationTarget.textContent = `${data.name}, ${data.sys.country}`;
    this.currentTemperatureTarget.textContent = `${data.main.temp}°C`;
    this.currentDescriptionTarget.textContent = data.weather[0].description;
    this.currentIconTarget.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  }
}
