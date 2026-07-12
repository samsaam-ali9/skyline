'use strict';

/* ==========================================================================
   SKYLINE — Weather Dashboard Script
   Sections: Config → DOM refs → State → Utils → Theme → Particles →
             Clock → Rendering → API → Events → Init
   ========================================================================== */

/* ---------- CONFIG ---------- */
const OPENWEATHER_API_KEY = '495b9131505a51c58607df3667610c3a';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const LAST_CITY_STORAGE_KEY = 'skyline:lastCity';




/* ---------- DOM REFS ---------- */
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorTitle = document.getElementById('errorTitle');
const errorMessage = document.getElementById('errorMessage');
const errorRetryBtn = document.getElementById('errorRetryBtn');
const emptyState = document.getElementById('emptyState');
const weatherCard = document.getElementById('weatherCard');

const cityNameEl = document.getElementById('cityName');
const countryNameEl = document.getElementById('countryName');
const weatherIconEl = document.getElementById('weatherIcon');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const pressureEl = document.getElementById('pressure');
const visibilityEl = document.getElementById('visibility');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');
const sunPositionEl = document.getElementById('sunPosition');

const clockTimeEl = document.getElementById('clockTime');
const clockDateEl = document.getElementById('clockDate');
const particlesContainer = document.getElementById('particles');

/* ---------- STATE ---------- */
let particleIntervalId = null;





/* ---------- UTILS ---------- */

/** Formats a unix timestamp (seconds) into a locale time string like "05:42 AM" */
const formatTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
};

/** Capitalizes the first letter of each word */
const toTitleCase = (text) =>
  text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));

/** Clears children from a DOM node */
const clearNode = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
};




/* ---------- THEME ---------- */

/**
 * Maps an OpenWeatherMap condition group to one of our visual themes.
 * Reference: https://openweathermap.org/weather-conditions
 */
const getThemeFromCondition = (weatherMain, isNight) => {
  const key = weatherMain.toLowerCase();

  if (isNight && (key === 'clear')) return 'night';
  if (key === 'clear') return 'clear';
  if (key === 'clouds') return 'clouds';
  if (key === 'rain' || key === 'drizzle') return 'rain';
  if (key === 'thunderstorm') return 'storm';
  if (key === 'snow') return 'snow';
  if (['mist', 'fog', 'haze', 'smoke', 'dust', 'sand', 'ash', 'squall', 'tornado'].includes(key)) {
    return 'mist';
  }
  return 'clear';
};

/** Applies a theme name to <body> and swaps the background particle system */
const applyTheme = (themeName) => {
  document.body.className = `theme-${themeName}`;
  document.body.dataset.theme = themeName;
  startParticles(themeName);
};





/* ---------- PARTICLES ---------- */

/** Spawns a single falling particle (rain drop or snowflake) */
const spawnParticle = (type) => {
  const particle = document.createElement('span');
  particle.className = `particle particle--${type}`;
  particle.style.left = `${Math.random() * 100}%`;

  if (type === 'rain') {
    particle.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
  } else {
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    particle.style.opacity = `${0.4 + Math.random() * 0.6}`;
  }

  particlesContainer.appendChild(particle);
  particle.addEventListener('animationend', () => particle.remove());
};



/** Starts (or stops) the ambient particle system based on the active theme */
const startParticles = (themeName) => {
  if (particleIntervalId) {
    clearInterval(particleIntervalId);
    particleIntervalId = null;
  }
  clearNode(particlesContainer);

  if (themeName === 'rain' || themeName === 'storm') {
    particleIntervalId = setInterval(() => spawnParticle('rain'), 60);
  } else if (themeName === 'snow') {
    particleIntervalId = setInterval(() => spawnParticle('snow'), 200);
  }
};





/* ---------- CLOCK ---------- */

/** Updates the on-screen digital clock and full date, ticking every second */
const updateClock = () => {
  const now = new Date();
  clockTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
  clockDateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};





/* ---------- UI STATE SWITCHING ---------- */

/** Shows exactly one of the four view states: loading, error, empty, weather */
const setView = (view) => {
  loadingState.hidden = view !== 'loading';
  errorState.hidden = view !== 'error';
  emptyState.hidden = view !== 'empty';
  weatherCard.hidden = view !== 'weather';
  searchBtn.disabled = view === 'loading';
};

const showError = (title, message) => {
  errorTitle.textContent = title;
  errorMessage.textContent = message;
  setView('error');
};





/* ---------- RENDERING ---------- */

/** Renders a successful weather API response into the weather card */
const renderWeather = (data) => {
  const { name, sys, main, weather, wind, visibility, timezone } = data;
  const condition = weather[0];

  const nowUtc = Math.floor(Date.now() / 1000);
  const localNow = nowUtc + timezone;
  const isNight = localNow < sys.sunrise + timezone || localNow > sys.sunset + timezone;

  cityNameEl.textContent = name;
  countryNameEl.textContent = sys.country || '';

  weatherIconEl.src = `https://openweathermap.org/img/wn/${condition.icon}@4x.png`;
  weatherIconEl.alt = condition.description;

  temperatureEl.textContent = `${Math.round(main.temp)}°C`;
  descriptionEl.textContent = toTitleCase(condition.description);
  feelsLikeEl.textContent = `Feels like ${Math.round(main.feels_like)}°C`;

  humidityEl.textContent = `${main.humidity}%`;
  windSpeedEl.textContent = `${wind.speed} m/s`;
  pressureEl.textContent = `${main.pressure} hPa`;
  visibilityEl.textContent = `${(visibility / 1000).toFixed(1)} km`;

  sunriseEl.textContent = formatTime(sys.sunrise, timezone);
  sunsetEl.textContent = formatTime(sys.sunset, timezone);

  // Position the sun dot along the sunrise → sunset track
  const dayLength = sys.sunset - sys.sunrise;
  const elapsed = nowUtc - sys.sunrise;
  const progress = Math.min(1, Math.max(0, elapsed / dayLength));
  sunPositionEl.style.left = `${progress * 100}%`;

  applyTheme(getThemeFromCondition(condition.main, isNight));
  setView('weather');
};





/* ---------- API ---------- */

/**
 * Fetches current weather for a city from OpenWeatherMap.
 * Throws a descriptive Error for the caller to handle and display.
 */
const fetchWeatherByCity = async (city) => {

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new Error('NETWORK_ERROR');
  }

  if (response.status === 404) {
    throw new Error('CITY_NOT_FOUND');
  }
  if (response.status === 401) {
    throw new Error('INVALID_KEY');
  }
  if (!response.ok) {
    throw new Error('API_ERROR');
  }

  return response.json();
};



/** Orchestrates a search: validates input, shows loading, fetches, renders or errors */
const searchWeather = async (rawCity) => {
  const city = rawCity.trim();

  if (!city) {
    showError('Enter a city', 'Type a city name to see its current weather.');
    return;
  }

  setView('loading');

  try {
    const data = await fetchWeatherByCity(city);
    renderWeather(data);
    localStorage.setItem(LAST_CITY_STORAGE_KEY, city);
  } catch (error) {
    switch (error.message) {
      case 'CITY_NOT_FOUND':
        showError('City not found', `We couldn't find "${city}". Check the spelling and try again.`);
        break;
      case 'NETWORK_ERROR':
        showError('No connection', 'Check your internet connection and try again.');
        break;
      default:
        showError('Something went wrong', 'The weather service is unavailable right now. Please try again shortly.');
    }
  }
};



/* ---------- EVENTS ---------- */

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchWeather(cityInput.value);
});

errorRetryBtn.addEventListener('click', () => {
  searchWeather(cityInput.value || localStorage.getItem(LAST_CITY_STORAGE_KEY) || '');
});

/* ---------- INIT ---------- */

const init = () => {
  updateClock();
  setInterval(updateClock, 1000);

  cityInput.focus();

  const lastCity = localStorage.getItem(LAST_CITY_STORAGE_KEY);
  if (lastCity) {
    cityInput.value = lastCity;
    searchWeather(lastCity);
  } else {
    setView('empty');
  }
};

document.addEventListener('DOMContentLoaded', init);
