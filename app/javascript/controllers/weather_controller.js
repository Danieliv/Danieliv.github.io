import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["city",
                    "cloudiness",
                    "currentDescription",
                    "currentIcon",
                    "currentLocation",
                    "currentTemperature",
                    "feelsLike",
                    "humidity",
                    "inputLocation",
                    "latitude",
                    "longitude",
                    "maxTemp",
                    "minTemp",
                    "pressure",
                    "sunrise",
                    "sunset",
                    "windDirection",
                    "windSpeed"];

  connect() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  async showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const data = await this.getWeather(`/get_weather?latitude=${latitude}&longitude=${longitude}`);
    this.updateWeather(data);
  }

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
    this.currentTemperatureTarget.textContent = `${data.main.temp}°F`;
    this.currentDescriptionTarget.textContent = data.weather[0].description;
    this.feelsLikeTarget.textContent = data.main.feels_like;
    this.minTempTarget.textContent = data.main.temp_min;
    this.maxTempTarget.textContent = data.main.temp_max;
    this.humidityTarget.textContent = data.main.humidity;
    this.windSpeedTarget.textContent = data.wind.speed;
    this.windDirectionTarget.textContent = data.wind.deg;
    this.cloudinessTarget.textContent = data.clouds.all;
    this.pressureTarget.textContent = data.main.pressure;
    this.sunriseTarget.textContent = (new Date(data.sys.sunrise * 1000).toLocaleTimeString());
    this.sunsetTarget.textContent = (new Date(data.sys.sunset * 1000).toLocaleTimeString());
    this.currentIconTarget.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  }
}
