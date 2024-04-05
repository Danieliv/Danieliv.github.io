import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["city",
                    "cloudiness",
                    "forecasContainer",
                    "currentDate",
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
                    "searchForm",
                    "sunrise",
                    "sunset",
                    "windDirection",
                    "windSpeed"];

  connect() {
    this.refreshDate();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  refreshDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.currentDateTarget.textContent = currentDate.toLocaleDateString('en-US', options);
  }

  async showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const weatherData = await this.getWeather(`/get_weather?latitude=${latitude}&longitude=${longitude}`);
    const forecastData = await this.getWeather(`/get_forecast?latitude=${latitude}&longitude=${longitude}&count=5`);
    this.updateWeather(weatherData);
    this.renderForecast(forecastData);
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
    } finally {
      this.searchFormTarget.reset();
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
    // this.windDirectionTarget.textContent = data.wind.deg;
    this.cloudinessTarget.textContent = data.clouds.all;
    this.pressureTarget.textContent = data.main.pressure;
    this.sunriseTarget.textContent = (new Date(data.sys.sunrise * 1000).toLocaleTimeString());
    this.sunsetTarget.textContent = (new Date(data.sys.sunset * 1000).toLocaleTimeString());
    this.currentIconTarget.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  }

  renderForecast(forecastData) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const forecastHTML = forecastData.list.map(day => `
      <div class="forecast-item row align-items-center">
        <div class="col-auto">
          <p class="date">${new Date(day.dt_txt).toLocaleDateString('en-US', options)}</p>
        </div>
        <div class="col">
          <img class="forecast-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
          <span class="forecast-temperature">${day.main.temp_min}°F - ${day.main.temp_max}°F</span>
        </div>
      </div>
    `).join("");

    this.forecasContainerTarget.innerHTML = forecastHTML;
  }
}
