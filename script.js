const apiKey = "498529136867820945a1b930aa5c6166";

function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      () => {
        alert("Geolocation is disabled. Please enable it to use this feature.");
      }
    );
  }
}

function fetchWeatherByCity() {
  const city = document.getElementById("city-input").value;
  fetchWeatherData(null, null, city);
}

async function fetchWeatherData(lat, lon, city = null) {
  const url = city
    ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();
  updateWeatherDisplay(data);
  fetchForecastData(data.coord.lat, data.coord.lon);
}

function updateWeatherDisplay(data) {
  const { name, main, weather, wind } = data;

  document.getElementById("city-name").textContent = `${name}`;
  document.getElementById("temperature").textContent = `${main.temp}°C`;
  document.getElementById("condition").textContent = weather[0].description;
  document.getElementById("humidity").textContent = main.humidity;
  document.getElementById(
    "weather-icon"
  ).src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  document.body.style.backgroundImage = `url('./images/${weather[0].main.toLowerCase()}.jpg')`;
}

async function fetchForecastData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  updateForecastDisplay(data.list);
}

function updateForecastDisplay(forecast) {
  const forecastContainer = document.getElementById("forecast-list");
  forecastContainer.innerHTML = "";

  const dailyForecasts = forecast
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  dailyForecasts.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.className = "forecast-day";
    dayElement.innerHTML = `
            <h3>${new Date(day.dt_txt).toLocaleDateString("en-US", {
              weekday: "short",
            })}</h3>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" class="weather-icon" alt="Weather Icon">
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;
    forecastContainer.appendChild(dayElement);
  });

  const highlightsContainer = document.getElementById("highlights-list");
  highlightsContainer.innerHTML = ""; // Clear previous highlights
  const currentHighlight = forecast[0]; // Example: Show the first item's highlights

  // Create a highlight div
  highlightsContainer.innerHTML = `
    <div class="highlight-item">
    <i class="fas fa-wind"></i>
        <h4>Wind Speed</h4>
        <p>${currentHighlight.wind.speed} m/s</p>
    </div>
    <div class="highlight-item">
    <i class="fas fa-tint"></i>
        <h4>Humidity</h4>
        <p>${currentHighlight.main.humidity}%</p>
    </div>
    <div class="highlight-item">
    <i class="fas fa-tachometer-alt"></i> 
        <h4>Pressure</h4>
        <p>${currentHighlight.main.pressure} hPa</p>
    </div>
`;
}

async function fetchWeatherData(lat, lon, city = null) {
  const url = city
    ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();
  updateWeatherDisplay(data);
  fetchForecastData(data.coord.lat, data.coord.lon);
}

function updateWeatherDisplay(data) {
  const { name, main, weather, wind } = data;
  document.getElementById("city-name").textContent = `${name}`;
  document.getElementById("temperature").textContent = `${main.temp}°C`;
  document.getElementById("condition").textContent = weather[0].description;
  document.getElementById("humidity").textContent = main.humidity;
  document.getElementById("wind").textContent = wind.speed;
  document.getElementById(
    "weather-icon"
  ).src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  setWeatherSidebarColors(weather[0].main.toLowerCase());
}
function setWeatherSidebarColors(condition) {
  const sidebar = document.getElementById("sidebar");

  // Match condition keywords
  const lowerCaseCondition = condition.toLowerCase();

  if (lowerCaseCondition.includes("clear")) {
    sidebar.style.backgroundImage = "url('./images/sunny.jpg')";
  } else if (lowerCaseCondition.includes("cloud")) {
    sidebar.style.backgroundImage = "url('./images/cloudy.jpg')";
  } else if (lowerCaseCondition.includes("rain")) {
    sidebar.style.backgroundImage = "url('./images/rainy.jpg')";
  } else if (lowerCaseCondition.includes("snow")) {
    sidebar.style.backgroundImage = "url('./images/snowy.jpg')";
  } else {
    sidebar.style.backgroundImage = "url('./images/sunny.jpg')";
  }
}

window.onload = function () {
  fetchWeatherData(null, null, "lusaka");
  fetchWeatherByLocation();
};
