import { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getWeatherData } from '../services/weatherService';
import { WeatherData } from '../types/weather';
import { CurrentWeatherCard, ForecastCard } from './WeatherCard';

export default function WeatherModule() {
  const { t } = useLanguage();
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await getWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t.enterCity}
          className="flex-1 px-4 py-3 text-lg border-2 border-[#40916c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#40916c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          {t.searchCity}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2d6a4f] border-t-transparent mx-auto"></div>
        </div>
      )}

      {weatherData && !loading && (
        <div className="space-y-6">
          <CurrentWeatherCard
            city={weatherData.city}
            temp={weatherData.current.temp}
            humidity={weatherData.current.humidity}
            windSpeed={weatherData.current.windSpeed}
            description={weatherData.current.description}
            icon={weatherData.current.icon}
          />
          <ForecastCard forecast={weatherData.forecast} />
        </div>
      )}
    </div>
  );
}
