const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// Selecting the tabs and content elements
const yourWeatherTab = document.getElementById('weather-user');
const searchWeatherTab = document.getElementById('weather-searched');
const grantLocationDiv = document.querySelector('.grant-location');
const searchWeatherDiv = document.querySelector('.search-weather');
const showWeatherDiv = document.querySelector('.show-weather');
const cardsDiv = document.querySelector('.cards');
const loadingDiv = document.getElementById('loading');
const grantButton = document.querySelector('.grant-button');

// Selecting search elements
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.input-tag');

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeather(lat, lon) {
    loadingDiv.style.display = 'block';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        updateWeatherUI(data);
        loadingDiv.style.display = 'none';
    } catch (error) {
        loadingDiv.style.display = 'none';
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Function to handle searching weather by city name
async function handleSearchWeather() {
    const city = searchInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    console.log('Searching for city:', city); // Debugging line
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    console.log('Fetch URL:', url); // Debugging line

    loadingDiv.style.display = 'block';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        updateWeatherUI(data);
        loadingDiv.style.display = 'none';
    } catch (error) {
        loadingDiv.style.display = 'none';
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Function to update the weather UI with fetched data
function updateWeatherUI(data) {
    document.querySelector('[city-name]').textContent = data.name;
    document.querySelector('[weather-type]').textContent = data.weather[0].description;
    document.querySelector('[weather-temp]').textContent = `${data.main.temp} °C`;

    document.querySelector('[weather-windSpeed]').textContent = `${data.wind.speed} m/s`;
    document.querySelector('[weather-humidity]').textContent = `${data.main.humidity}%`;
    document.querySelector('[weather-cloudiness]').textContent = `${data.clouds.all}%`;

    const countryCode = data.sys.country.toLowerCase();
    const flagUrl = `https://flagpedia.net/data/flags/h80/${countryCode}.png`;
    const flagImg = document.querySelector('[city-flag]');
    flagImg.src = flagUrl;
    flagImg.alt = `${data.name} Flag`;

    showWeatherDiv.classList.add('active');
    cardsDiv.classList.add('active');
}

// Function to handle tab switching
function tabWeather(type) {
    resetUI();

    if (type === 'yourWeather') {
        yourWeatherTab.classList.add('selected-tab');
        searchWeatherTab.classList.remove('selected-tab');
        grantLocationDiv.classList.add('active');
        searchWeatherDiv.classList.remove('active');
    } else if (type === 'searchWeather') {
        searchWeatherTab.classList.add('selected-tab');
        yourWeatherTab.classList.remove('selected-tab');
        searchWeatherDiv.classList.add('active');
        grantLocationDiv.classList.remove('active');
    }
}

// Function to handle granting location access
function handleGrantLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);

                grantLocationDiv.classList.remove('active');
                showWeatherDiv.classList.add('active');
                cardsDiv.classList.add('active');
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to reset the UI to initial state
function resetUI() {
    showWeatherDiv.classList.remove('active');
    cardsDiv.classList.remove('active');

    document.querySelector('[city-name]').textContent = '';
    document.querySelector('[weather-type]').textContent = '';
    document.querySelector('[weather-temp]').textContent = '';
    document.querySelector('[weather-windSpeed]').textContent = '';
    document.querySelector('[weather-humidity]').textContent = '';
    document.querySelector('[weather-cloudiness]').textContent = '';
    document.querySelector('[city-flag]').src = '';

    loadingDiv.style.display = 'none';
}

const searchButtonDiv = document.querySelector('.search-button-input');
// Adding event listeners to the tabs
yourWeatherTab.addEventListener('click', () => tabWeather('yourWeather'));
searchWeatherTab.addEventListener('click', () => tabWeather('searchWeather'));

// Adding event listener to the grant button
grantButton.addEventListener('click', handleGrantLocation);

// Adding event listener to the search button
searchButtonDiv.addEventListener('click', handleSearchWeather);

// Initial display
tabWeather('yourWeather');
