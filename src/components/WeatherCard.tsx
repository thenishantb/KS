import { Cloud, Droplets, Wind } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ForecastDay } from '../types/weather';

interface CurrentWeatherProps {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

export function CurrentWeatherCard({
  city,
  temp,
  humidity,
  windSpeed,
  description,
  icon,
}: CurrentWeatherProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#40916c]">
      <h3 className="text-2xl font-bold text-[#2d6a4f] mb-4 flex items-center gap-2">
        <Cloud className="w-6 h-6" />
        {t.currentWeather} - {city}
      </h3>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-20 h-20"
          />
          <div>
            <p className="text-5xl font-bold text-[#2d6a4f]">{Math.round(temp)}°C</p>
            <p className="text-lg text-gray-600 capitalize mt-1">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
          <Droplets className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">{t.humidity}</p>
            <p className="text-lg font-semibold text-gray-800">{humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
          <Wind className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-sm text-gray-600">{t.windSpeed}</p>
            <p className="text-lg font-semibold text-gray-800">{windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#40916c]">
      <h3 className="text-2xl font-bold text-[#2d6a4f] mb-4">{t.forecast5Day}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#fffaf0] to-white p-4 rounded-lg border border-[#40916c] hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-semibold text-gray-700 mb-2">{formatDate(day.date)}</p>

            <div className="flex justify-center mb-2">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                className="w-12 h-12"
              />
            </div>

            <p className="text-xs text-gray-600 capitalize text-center mb-3">{day.description}</p>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600 font-semibold">{t.max}:</span>
                <span className="font-bold">{Math.round(day.tempMax)}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-semibold">{t.min}:</span>
                <span className="font-bold">{Math.round(day.tempMin)}°C</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <Droplets className="w-4 h-4" />
                <span>{day.humidity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
