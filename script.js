const form = document.getElementById('weather-form');
const celc = -273.15;
const generateTemperatureHTML = (forecastData) => {
	let html = '';
	forecastData.forEach((day) => {
		const date = new Date(day.date);
		const formattedDate = date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'long',
			day: 'numeric',
		});

		const iconUrl = day.day.condition.icon;

		html += `
            <div class="forecast-day">
                <h3>${formattedDate}</h3>
                <img src="${iconUrl}" alt="Weather Icon"> <!-- Display weather icon -->
                <p>Avg Temperature: ${day.day.avgtemp_c}°C</p>
                <p>Max Temperature: ${day.day.maxtemp_c}°C</p>
                <p>Min Temperature: ${day.day.mintemp_c}°C</p>
            </div>
        `;
	});
	return html;
};

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const forecastContainer = document.querySelector('.forecast-container');
	forecastContainer.innerHTML = '';

	const cityName = document.getElementById('city').value;
	const h2 = document.createElement('h2');
	h2.textContent = cityName;
	forecastContainer.appendChild(h2);

	const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=4b149762fd9240b0897142727242003&q=${cityName}&days=5`;

	const response = await fetch(apiURL);
	const data = await response.json();
	console.log(data);

	const forecastData = data.forecast.forecastday;
	const temperatureHTML = generateTemperatureHTML(forecastData);
	forecastContainer.innerHTML = temperatureHTML;

	const unsplashApi = `uG0mam9XKvHNebd8ERu4hp4fCc7dca_w892cho1AvMI`;
	const unsplashURL = `https://api.unsplash.com/photos/random?query=${cityName}&client_id=${unsplashApi}`;

	const unsplashResponse = await fetch(unsplashURL);
	const unsplashData = await unsplashResponse.json();
	const rawURL = unsplashData.urls.raw;
	const img = document.getElementById('img');
	img.style.backgroundImage = `url(${rawURL})`;

	const temperatureData = forecastData.map((day) => ({
		date: new Date(day.date).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'long',
			day: 'numeric',
		}),
		avgTemperature: day.day.avgtemp_c,
	}));
	const existingChart = Chart.getChart('chart');
	if (existingChart) {
		existingChart.destroy();
	}
	new Chart(document.getElementById('chart'), {
		type: 'line',
		data: {
			labels: temperatureData.map((day) => day.date),
			datasets: [
				{
					label: 'Average Temperature (°C)',
					data: temperatureData.map((day) => day.avgTemperature),
					borderColor: 'rgba(255,99,132,1)',
					borderWidth: 1,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: false,
					grid: {
						color: 'rgba(255,255,255,0.2)',
					},
					ticks: {
						color: 'rgba(255,255,255,0.7)',
					},
				},
				x: {
					grid: {
						color: 'rgba(255,255,255,0.2)',
					},
					ticks: {
						color: 'rgba(255,255,255,0.7)',
					},
				},
			},
		},
	});
});
