const apiKey = "e1a263ca279351ec4ca2352981f88ec5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

/* Search Weather */

searchBtn.addEventListener("click", () => {

  const city = cityInput.value.trim();

  if (city !== "") {
    getWeatherByCity(city);
  }
});

/* Enter Key */

cityInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {

    const city = cityInput.value.trim();

    if (city !== "") {
      getWeatherByCity(city);
    }
  }
});

/* Location Weather */

locationBtn.addEventListener("click", () => {

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getWeatherByCoords(lat, lon);
    },

    () => {
      alert("Location access denied");
    }
  );
});

/* Weather By City */

async function getWeatherByCity(city) {

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const data = await response.json();

    displayWeather(data);

    getForecast(city);

  } catch (error) {
    console.log(error);
  }
}

/* Weather By Coordinates */

async function getWeatherByCoords(lat, lon) {

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const data = await response.json();

    displayWeather(data);

    getForecast(data.name);

  } catch (error) {
    console.log(error);
  }
}

/* Display Weather */

function displayWeather(data) {

  document.getElementById("temperature").innerText =
    `${Math.round(data.main.temp)}°C`;

  document.getElementById("weatherCondition").innerText =
    data.weather[0].description;

  document.getElementById("cityName").innerText =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("humidity").innerText =
    `${data.main.humidity}%`;

  document.getElementById("wind").innerText =
    `${Math.round(data.wind.speed)} km/h`;

  document.getElementById("feelsLike").innerText =
    `${Math.round(data.main.feels_like)}°C`;

  document.getElementById("visibility").innerText =
    `${data.visibility / 1000} km`;
  
  getAQI(data.coord.lat, data.coord.lon);

  updateWeatherMap(
  data.coord.lat,
  data.coord.lon
);

  const icon =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  document.getElementById("weatherIcon").src = icon;

  updateBackground(data.weather[0].main.toLowerCase());
}

/* Forecast */

async function getForecast(city) {

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    const data = await response.json();

    displayForecast(data);

    displayHourlyForecast(data);

  } catch (error) {
    console.log(error);
  }
}

function displayForecast(data){

  const forecastContainer =
    document.getElementById("forecastContainer");

  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {

    const date = new Date(day.dt_txt);

    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short"
    });

    const icon =
      `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const card = `
      <div class="forecast-card">

        <div class="forecast-day">
          ${dayName}
        </div>

        <div class="forecast-icon">
          <img src="${icon}">
        </div>

        <div class="forecast-temp">
          ${Math.round(day.main.temp)}°C
        </div>

        <div class="forecast-condition">
          ${day.weather[0].main}
        </div>

      </div>
    `;

    forecastContainer.innerHTML += card;
  });
}
/* =========================
   HOURLY FORECAST
========================= */

function displayHourlyForecast(data){

  const hourlyContainer =
    document.getElementById("hourlyContainer");

  hourlyContainer.innerHTML = "";

  data.list.slice(0,8).forEach(hour => {

    const time = new Date(hour.dt_txt)
      .toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
      });

    const icon =
      `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;

    const card = `
      <div class="hour-card">

        <div class="hour-time">
          ${time}
        </div>

        <div class="hour-icon">
          <img src="${icon}">
        </div>

        <div class="hour-temp">
          ${Math.round(hour.main.temp)}°C
        </div>

        <div class="hour-condition">
          ${hour.weather[0].main}
        </div>

      </div>
    `;

    hourlyContainer.innerHTML += card;

  });

}
/* =========================
   AQI SYSTEM
========================= */

async function getAQI(lat, lon){

  try{

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const data = await response.json();

    displayAQI(data);

  }catch(error){

    console.log(error);

  }

}

function displayAQI(data){

  const aqi =
    data.list[0].main.aqi;

  const aqiValue =
    document.getElementById("aqiValue");

  const aqiStatus =
    document.getElementById("aqiStatus");

  let status = "";

  switch(aqi){

    case 1:
      status = "Good 🟢";
      break;

    case 2:
      status = "Fair 🟡";
      break;

    case 3:
      status = "Moderate 🟠";
      break;

    case 4:
      status = "Poor 🔴";
      break;

    case 5:
      status = "Very Poor ⚫";
      break;

  }

  aqiValue.innerHTML = aqi;

  aqiStatus.innerHTML = status;

}
/* =========================
   WEATHER MAP
========================= */

function updateWeatherMap(lat, lon){

  const map =
    document.getElementById("weatherMap");

  map.src =
    `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=6`;
}
/* =========================
   FAVORITE CITIES
========================= */

const saveCityBtn =
  document.getElementById("saveCityBtn");

let favorites = JSON.parse(
  localStorage.getItem("favorites")
) || [];

saveCityBtn.addEventListener("click", () => {

  const city =
    cityInput.value.trim();

  if(city && !favorites.includes(city)){

    favorites.push(city);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );

    renderFavorites();

  }

});

function renderFavorites(){

  const favoritesContainer =
    document.getElementById("favoritesContainer");

  favoritesContainer.innerHTML = "";

  favorites.forEach(city => {

    const cityCard =
      document.createElement("div");

    cityCard.className =
      "favorite-city";

    cityCard.innerText = city;

    cityCard.addEventListener("click", () => {

      getWeather(city);

      getForecast(city);

    });

    favoritesContainer.appendChild(cityCard);

  });

}

renderFavorites();
/* Background Effects */

function updateBackground(weather) {

  const body = document.body;
  const effectsContainer = document.querySelector(".weather-effects");

  effectsContainer.innerHTML = "";

  switch (weather) {

    case "clear":

      body.style.background =
        "linear-gradient(135deg, #0f172a, #1e3a8a, #38bdf8)";

      createSunGlow();

      break;

    case "clouds":

      body.style.background =
        "linear-gradient(135deg, #1e293b, #475569, #94a3b8)";

      createClouds();

      break;

    case "rain":
    case "drizzle":

      body.style.background =
        "linear-gradient(135deg, #0f172a, #1e293b, #334155)";

      createRain();

      break;

    default:

      body.style.background =
        "linear-gradient(135deg, #0f172a, #1e293b, #312e81)";
  }
}

function createRain() {

  const effectsContainer = document.querySelector(".weather-effects");

  for (let i = 0; i < 80; i++) {

    const rain = document.createElement("div");

    rain.classList.add("rain-drop");

    rain.style.left = Math.random() * 100 + "vw";

    rain.style.animationDuration =
      Math.random() * 1 + 0.5 + "s";

    effectsContainer.appendChild(rain);
  }
}

function createClouds() {

  const effectsContainer = document.querySelector(".weather-effects");

  for (let i = 0; i < 6; i++) {

    const cloud = document.createElement("div");

    cloud.classList.add("cloud");

    cloud.style.top = Math.random() * 50 + "vh";

    cloud.style.animationDuration =
      Math.random() * 20 + 25 + "s";

    effectsContainer.appendChild(cloud);
  }
}

function createSunGlow() {

  const effectsContainer = document.querySelector(".weather-effects");

  const sun = document.createElement("div");

  sun.classList.add("sun-glow");

  effectsContainer.appendChild(sun);
}

/* Default Weather */

getWeatherByCity("London");
