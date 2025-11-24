import { WeatherData, ForecastDay } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherData(city: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is missing');
  }

  const currentResponse = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );

  if (!currentResponse.ok) {
    throw new Error('City not found or API error');
  }

  const currentData = await currentResponse.json();

  const forecastResponse = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );

  if (!forecastResponse.ok) {
    throw new Error('Forecast data unavailable');
  }

  const forecastData = await forecastResponse.json();

  const dailyForecasts: ForecastDay[] = [];
  const processedDates = new Set<string>();

  for (const item of forecastData.list) {
    const date = new Date(item.dt * 1000);
    const dateString = date.toISOString().split('T')[0];

    if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
      processedDates.add(dateString);
      dailyForecasts.push({
        date: dateString,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      });
    }
  }

  return {
    city: currentData.name,
    current: {
      temp: currentData.main.temp,
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
    },
    forecast: dailyForecasts,
  };
}
