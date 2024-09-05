async function findUserLocation() {
    const location = document.getElementById('userLocation').value;
    const unit = document.getElementById('converter').value.includes('°C') ? 'metric' : 'imperial';
    const apiKey = '6a27700e312300262228ce349111df39'; // Replace with your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data, unit);
        } else {
            alert(data.message); 
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data, unit) {
    document.querySelector('.weatherIcon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"/>`;
    document.querySelector('.temperature').innerHTML = `${TemConverter(data.main.temp, unit)}`;
    document.querySelector('.feelsLike').innerHTML = `Feels like: ${TemConverter(data.main.feels_like, unit)}`;
    document.querySelector('.description').innerHTML = data.weather[0].description;
    document.querySelector('.date').innerHTML = new Date().toLocaleDateString();
    document.querySelector('.city').innerHTML = `${data.name}, ${data.sys.country}`;

    document.getElementById('HValue').innerHTML = `${data.main.humidity}<span>%</span>`;
    document.getElementById('WValue').innerHTML = `${Math.round(data.wind.speed)} ${unit === 'metric' ? 'm/s' : 'mph'}`;
    document.getElementById('SRValue').innerHTML = formatUnixTime(data.sys.sunrise, data.timezone, { hour: "numeric", minute: "numeric", hour12: true });
    document.getElementById('SSValue').innerHTML = formatUnixTime(data.sys.sunset, data.timezone, { hour: "numeric", minute: "numeric", hour12: true });
    document.getElementById('CValue').innerHTML = `${data.clouds.all}<span>%</span>`;
    document.getElementById('UVValue').innerHTML = 'N/A'; 
    document.getElementById('PValue').innerHTML = `${data.main.pressure}<span> hPa</span>`;

    fetchWeeklyForecast(data.coord.lat, data.coord.lon, unit);
}

function fetchWeeklyForecast(lat, lon, unit) {
    const apiKey = '6a27700e312300262228ce349111df39'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector('.Forecast');
            forecastContainer.innerHTML = '';

            data.daily.forEach((weather) => {
                let div = document.createElement('div');
                const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
                div.innerHTML = `<strong>${new Date(weather.dt * 1000).toLocaleDateString(undefined, dateOptions)}</strong><br>`;
                div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}"/>`;
                div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}<br>
                                    <span>${TemConverter(weather.temp.min, unit)} - ${TemConverter(weather.temp.max, unit)}</span></p>`;
                forecastContainer.appendChild(div);
            });
        });
}

function formatUnixTime(dtValue, timeZone, options = {}) {
    const date = new Date(dtValue * 1000);
    return date.toLocaleTimeString([], { timeZone, ...options });
}

function TemConverter(temp, unit) {
    let tempValue = Math.round(temp);
    if (unit === 'metric') {
        return `${tempValue} <span>&#176;C</span>`;
    } else {
        let ctof = (tempValue * 9) / 5 + 32;
        return `${ctof} <span>&#176;F</span>`;
    }
}

document.querySelector('.fa-search').addEventListener('click', findUserLocation);