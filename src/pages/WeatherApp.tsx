import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  ArrowLeft,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
}

const API_KEY = '8d6454e6c3b540de9e1131424241907';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherIcons: Record<string, LucideIcon> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Snow: CloudSnow,
  Thunderstorm: CloudLightning,
  Drizzle: CloudRain,
  Mist: Cloud,
  Fog: Cloud,
};

function getWeatherIcon(weatherMain: string): LucideIcon {
  return weatherIcons[weatherMain] || Cloud;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherRecentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = useCallback((cityName: string) => {
    setRecentSearches((prev) => {
      const updated = [cityName, ...prev.filter((c) => c !== cityName)].slice(0, 5);
      localStorage.setItem('weatherRecentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchWeather = useCallback(async (searchCity: string) => {
    if (!searchCity.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Fetch current weather
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );

      if (!weatherRes.ok) {
        throw new Error('City not found');
      }

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      // Fetch forecast
      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);

      saveRecentSearch(weatherData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [saveRecentSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const weatherRes = await fetch(
              `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const weatherData = await weatherRes.json();
            setCity(weatherData.name);
            fetchWeather(weatherData.name);
          } catch {
            setError('Failed to fetch weather for your location');
            setLoading(false);
          }
        },
        () => {
          setError('Unable to get your location');
          setLoading(false);
        }
      );
    }
  };

  // Get daily forecast (one entry per day)
  const dailyForecast = forecast?.list.filter((item, index, self) => {
    const date = item.dt_txt.split(' ')[0];
    return index === self.findIndex((i) => i.dt_txt.split(' ')[0] === date);
  }).slice(0, 5);

  const WeatherIcon = weather ? getWeatherIcon(weather.weather[0].main) : Cloud;

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-white">Weather </span>
            <span className="gradient-text">Forecast</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Get real-time weather updates and 5-day forecasts for any city.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </motion.button>
            <motion.button
              type="button"
              onClick={handleLocationClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10 transition-colors"
              title="Use my location"
            >
              <MapPin className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Recent:</span>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setCity(search);
                    fetchWeather(search);
                  }}
                  className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-sm hover:bg-white/10 hover:text-cyan-400 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Display */}
        <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              key={weather.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Current Weather */}
              <div className="glass-card-strong p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {weather.name}, {weather.sys.country}
                    </h2>
                    <p className="text-gray-400">{formatDate(Date.now() / 1000)}</p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <WeatherIcon className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400" />
                      </motion.div>
                      <div>
                        <div className="text-5xl sm:text-6xl font-bold text-white">
                          {Math.round(weather.main.temp)}°
                        </div>
                        <div className="text-gray-400 capitalize">
                          {weather.weather[0].description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                    {[
                      {
                        icon: Thermometer,
                        label: 'Feels Like',
                        value: `${Math.round(weather.main.feels_like)}°`,
                      },
                      {
                        icon: Droplets,
                        label: 'Humidity',
                        value: `${weather.main.humidity}%`,
                      },
                      {
                        icon: Wind,
                        label: 'Wind Speed',
                        value: `${weather.wind.speed} m/s`,
                      },
                      {
                        icon: Sun,
                        label: 'Pressure',
                        value: `${weather.main.pressure} hPa`,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="glass-card p-4 flex flex-col items-center text-center"
                      >
                        <stat.icon className="w-5 h-5 text-cyan-400 mb-2" />
                        <div className="text-lg font-semibold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {dailyForecast && dailyForecast.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {dailyForecast.map((day, index) => {
                      const DayIcon = getWeatherIcon(day.weather[0].main);
                      return (
                        <motion.div
                          key={day.dt}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="glass-card p-4 text-center"
                        >
                          <div className="text-sm text-gray-400 mb-2">
                            {formatDate(day.dt)}
                          </div>
                          <DayIcon className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white mb-1">
                            {Math.round(day.main.temp)}°
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {day.weather[0].description}
                          </div>
                          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                            <Droplets className="w-3 h-3" />
                            {day.main.humidity}%
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!weather && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Cloud className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Search for a city
            </h3>
            <p className="text-gray-400">
              Enter a city name above to get the current weather and forecast.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
