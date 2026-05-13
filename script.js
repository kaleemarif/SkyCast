const apiKey = "e1a263ca279351ec4ca2352981f88ec5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const loading = document.querySelector(".loading");
const errorMessage = document.querySelector(".error-message");
const weatherContent = document.querySelector(".weather-content");

const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const cityName = document.getElementById("cityName");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");

/* Search Weather */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city !== "") {
    getWeatherByCity(city);
  }
});

/* Enter Key Support */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

/* Current Location Weather */
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        getWeatherByCoords(lat, lon);
      },
      () => {
        showError("Location access denied.");
      }
    );
  }
});

/* Fetch Weather By City */
async function getWeatherByCity(city) {
  showLoading();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    displayWeather(data);

  } catch (error) {
    showError(error.message);
  }
}

/* Fetch Weather By Coordinates */
async function getWeatherByCoords(lat, lon) {
  showLoading();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch location weather");
    }

    const data = await response.json();

    displayWeather(data);

  } catch (error) {
    showError(error.message);
  }
}

/* Display Weather */
function displayWeather(data) {

  hideLoading();

  weatherContent.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  const weatherMain = data.weather[0].main.toLowerCase();

  temperature.innerHTML = `${Math.round(data.main.temp)}°C`;

  weatherCondition.innerHTML = data.weather[0].description;

  cityName.innerHTML = `${data.name}, ${data.sys.country}`;

  humidity.innerHTML = `${data.main.humidity}%`;

  windSpeed.innerHTML = `${Math.round(data.wind.speed)} km/h`;

  feelsLike.innerHTML = `${Math.round(data.main.feels_like)}°C`;

  visibility.innerHTML = `${data.visibility / 1000} km`;

  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  updateBackground(weatherMain);

  animateCard();
}

/* Dynamic Animated Background */
function updateBackground(weather) {

  const body = document.body;

  switch (weather) {

    case "clear":
      body.style.background =
        "linear-gradient(135deg, #0f172a, #1e3a8a, #38bdf8)";
      break;

    case "clouds":
      body.style.background =
        "linear-gradient(135deg, #1e293b, #475569, #94a3b8)";
      break;

    case "rain":
    case "drizzle":
      body.style.background =
        "linear-gradient(135deg, #0f172a, #1e293b, #334155)";
      break;

    case "thunderstorm":
      body.style.background =
        "linear-gradient(135deg, #111827, #312e81, #4c1d95)";
      break;

    case "snow":
      body.style.background =
        "linear-gradient(135deg, #94a3b8, #cbd5e1, #f8fafc)";
      break;

    case "mist":
    case "fog":
      body.style.background =
        "linear-gradient(135deg, #334155, #64748b, #94a3b8)";
      break;

    default:
      body.style.background =
        "linear-gradient(135deg, #0f172a, #1e293b, #312e81)";
  }
}

/* Smooth Card Animation */
function animateCard() {

  weatherContent.style.opacity = "0";
  weatherContent.style.transform = "translateY(20px)";

  setTimeout(() => {
    weatherContent.style.transition = "all 0.6s ease";

    weatherContent.style.opacity = "1";
    weatherContent.style.transform = "translateY(0)";
  }, 100);
}

/* Show Loading */
function showLoading() {

  loading.classList.remove("hidden");

  weatherContent.classList.add("hidden");

  errorMessage.classList.add("hidden");
}

/* Hide Loading */
function hideLoading() {

  loading.classList.add("hidden");
}

/* Error Handler */
function showError(message) {

  hideLoading();

  weatherContent.classList.add("hidden");

  errorMessage.classList.remove("hidden");

  errorMessage.innerHTML = `<p>${message}</p>`;
}

/* Default Weather */
getWeatherByCity("Jabalpur");
