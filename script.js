const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const searchButton = document.querySelector("#searchButton");
const statusText = document.querySelector("#status");
const weatherCard = document.querySelector("#weatherCard");

const weatherDescriptions = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Heavy drizzle", "🌧️"],
  56: ["Freezing drizzle", "🌧️"], 57: ["Freezing drizzle", "🌧️"],
  61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  66: ["Freezing rain", "🌧️"], 67: ["Heavy freezing rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "🌨️"], 80: ["Rain showers", "🌦️"], 81: ["Rain showers", "🌧️"],
  82: ["Heavy showers", "⛈️"], 85: ["Snow showers", "🌨️"], 86: ["Heavy snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with hail", "⛈️"]
};

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle("error", isError);
}

async function getWeather(city) {
  const cleanCity = city.trim();
  if (!cleanCity) return;

  searchButton.disabled = true;
  searchButton.textContent = "Searching…";
  weatherCard.classList.add("hidden");
  setStatus(`Looking up weather for ${cleanCity}…`);

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error("Could not contact the location service. Please try again.");
    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];
    if (!place) throw new Error(`No city found for "${cleanCity}". Check the spelling and try again.`);

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error("Could not load weather data. Please try again.");
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    if (!current) throw new Error("Weather data is currently unavailable for this city.");

    document.querySelector("#cityName").textContent = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
    document.querySelector("#dateText").textContent = formatDate(current.time, weatherData.timezone);
    document.querySelector("#temperature").textContent = Math.round(current.temperature_2m);
    document.querySelector("#feelsLike").textContent = Math.round(current.apparent_temperature);
    document.querySelector("#humidity").textContent = `${current.relative_humidity_2m}%`;
    document.querySelector("#wind").textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.querySelector("#pressure").textContent = `${Math.round(current.surface_pressure)} hPa`;
    document.querySelector("#visibility").textContent = "N/A";
    const [description, icon] = weatherDescriptions[current.weather_code] || ["Unknown conditions", "🌡️"];
    document.querySelector("#condition").textContent = description;
    document.querySelector("#weatherIcon").textContent = icon;
    weatherCard.classList.remove("hidden");
    setStatus("Weather updated successfully.");
  } catch (error) {
    setStatus(error.message || "Something went wrong. Please try again.", true);
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
}

function formatDate(dateTime, timeZone) {
  try {
    return new Intl.DateTimeFormat("en", {
      weekday: "long", year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", timeZone
    }).format(new Date(dateTime));
  } catch {
    return dateTime.replace("T", " ");
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeather(cityInput.value);
});

document.querySelectorAll("[data-city]").forEach((button) => {
  button.addEventListener("click", () => {
    cityInput.value = button.dataset.city;
    getWeather(button.dataset.city);
  });
});

// Load a default city on first visit.
getWeather("Kurnool");
