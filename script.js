const apiKey = "c8c5a2e532c2357279e04562e5b3a571";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const errorMessage = document.querySelector(".error-message");
const weatherInfo = document.querySelector(".weather-info");
const forecastSection = document.querySelector(".forecast");

// Weather icon mapping
const weatherIcons = {
  "01d": "fas fa-sun",
  "01n": "fas fa-moon",
  "02d": "fas fa-cloud-sun",
  "02n": "fas fa-cloud-moon",
  "03d": "fas fa-cloud",
  "03n": "fas fa-cloud",
  "04d": "fas fa-cloud",
  "04n": "fas fa-cloud",
  "09d": "fas fa-cloud-rain",
  "09n": "fas fa-cloud-rain",
  "10d": "fas fa-cloud-sun-rain",
  "10n": "fas fa-cloud-moon-rain",
  "11d": "fas fa-bolt",
  "11n": "fas fa-bolt",
  "13d": "fas fa-snowflake",
  "13n": "fas fa-snowflake",
  "50d": "fas fa-smog",
  "50n": "fas fa-smog"
};

// Check weather when search button is clicked
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    checkWeather(city);
  } else {
    showError("Please enter a city name");
  }
});

// Check weather when Enter key is pressed
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) {
      checkWeather(city);
    } else {
      showError("Please enter a city name");
    }
  }
});

async function checkWeather(city) {
  try {
    // Show loading state
    weatherInfo.style.display = "none";
    forecastSection.style.display = "none";
    errorMessage.style.display = "none";
    
    // Fetch current weather
    const weatherResponse = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);
    
    if (!weatherResponse.ok) {
      throw new Error(weatherResponse.status === 404 ? "City not found" : "Weather data unavailable");
    }

    const weatherData = await weatherResponse.json();

    // Fetch forecast
    const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
    
    if (!forecastResponse.ok) {
      throw new Error("Forecast data unavailable");
    }

    const forecastData = await forecastResponse.json();

    // Update UI with weather data
    updateWeatherUI(weatherData, forecastData);
    
  } catch (error) {
    showError(error.message);
  }
}

function updateWeatherUI(weatherData, forecastData) {
  // Update current weather
  document.querySelector(".city").textContent = weatherData.name;
  document.querySelector(".temperature").textContent = Math.round(weatherData.main.temp);
  document.querySelector(".description").textContent = weatherData.weather[0].description;
  
  // Update weather icon
  const weatherIconCode = weatherData.weather[0].icon;
  const weatherIconElement = document.querySelector(".weather-icon i");
  weatherIconElement.className = weatherIcons[weatherIconCode] || "fas fa-question";

  // Update details
  document.querySelector(".humidity").textContent = `${weatherData.main.humidity}%`;
  document.querySelector(".wind").textContent = `${(weatherData.wind.speed * 3.6).toFixed(1)} km/h`;
  document.querySelector(".feels-like").textContent = `${Math.round(weatherData.main.feels_like)}°C`;
  document.querySelector(".pressure").textContent = `${weatherData.main.pressure} hPa`;

  // Update forecast
  updateForecast(forecastData);

  // Show weather info and hide error
  weatherInfo.style.display = "block";
  forecastSection.style.display = "block";
  errorMessage.style.display = "none";
}

function updateForecast(forecastData) {
  const forecastItems = document.querySelector(".forecast-items");
  forecastItems.innerHTML = "";

  // Get daily forecast (every 24 hours)
  for (let i = 0; i < 40; i += 8) {
    const forecast = forecastData.list[i];
    if (!forecast) continue;
    
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(forecast.main.temp);
    const iconCode = forecast.weather[0].icon;

    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";
    forecastItem.innerHTML = `
      <div class="forecast-day">${day}</div>
      <i class="${weatherIcons[iconCode] || "fas fa-question"} forecast-icon"></i>
      <div class="forecast-temp">${temp}°C</div>
    `;

    forecastItems.appendChild(forecastItem);
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  weatherInfo.style.display = "none";
  forecastSection.style.display = "none";
}

// Initialize with default city
window.addEventListener('DOMContentLoaded', () => {
  checkWeather("Raipur");
});