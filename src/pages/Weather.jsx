import {
  ArrowLeft,
  CalendarDays,
  CloudRain,
  Droplets,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  ThermometerSun,
  Wind,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getWeather } from '../services/get-weather';
import { getSavedLocation } from '../utils/location-storage';

const weatherCodeText = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light rain showers',
  81: 'Moderate rain showers',
  82: 'Heavy rain showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm',
};

const getWeatherIcon = (code, isDay = 1) => {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code === 1) return isDay ? '🌤️' : '🌙';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([95, 96, 99].includes(code)) return '⛈️';

  return '🌡️';
};

const formatDay = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
};

const formatTime = (dateTime) => {
  if (!dateTime) return '--';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateTime));
};

const Weather = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const location = useMemo(() => {
    return routerLocation.state?.location || getSavedLocation();
  }, [routerLocation.state]);

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!location) return;

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setLoading(false);
      setError('This location has invalid coordinates.');
      return;
    }

    const controller = new AbortController();

    const loadWeather = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getWeather({
          latitude,
          longitude,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setWeather(data);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error('Weather fetch error:', err);

        if (!controller.signal.aborted) {
          setError(err.message || 'Unable to load weather data.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadWeather();

    return () => controller.abort();
  }, [location, reloadKey]);

  if (!location) {
    return <Navigate to='/' replace />;
  }

  const current = weather?.current;
  const daily = weather?.daily;

  const locationName = [location.name, location.country]
    .filter(Boolean)
    .join(', ');

  return (
    <main className='min-h-screen overflow-y-auto px-4 py-6 sm:px-6 lg:h-screen lg:overflow-hidden lg:px-6 lg:py-5'>
      <div className='mx-auto flex min-h-screen max-w-7xl flex-col lg:h-full lg:min-h-0'>
        <header className='mb-4 shrink-0 text-center sm:mb-5'>
          <div className='flex items-center justify-center gap-2 sm:gap-3'>
            <span className='text-4xl sm:text-5xl lg:text-6xl'>
              {getWeatherIcon(current?.weather_code, current?.is_day)}
            </span>

            <h1 className='text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl'>
              Weather
            </h1>
          </div>

          <div className='mt-2 flex max-w-full items-center justify-center gap-2 text-center text-base text-blue-100 sm:text-xl lg:text-2xl'>
            <MapPin
              size={19}
              className='shrink-0 text-fuchsia-200 sm:h-6 sm:w-6'
            />

            <p className='max-w-[260px] truncate sm:max-w-md'>
              {locationName || 'Current Location'}
            </p>
          </div>

          {weather?.timezone && (
            <p className='mt-1 text-xs text-blue-100/60'>
              Timezone: {weather.timezone}
            </p>
          )}
        </header>

        {loading && <LoadingCard />}

        {!loading && error && (
          <ErrorCard onRetry={() => setReloadKey((value) => value + 1)}>
            {error}
          </ErrorCard>
        )}

        {!loading && !error && current && daily && (
          <>
            <section className='shrink-0 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.11] p-5 shadow-[0_22px_55px_rgba(11,16,67,0.32)] backdrop-blur-xl sm:p-6 lg:p-7'>
              <div className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
                <div className='text-center lg:text-left'>
                  <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-blue-100'>
                    <ThermometerSun size={18} className='text-yellow-200' />
                    Current weather
                  </div>

                  <div className='mt-5 flex items-center justify-center gap-3 lg:justify-start'>
                    <span className='text-6xl sm:text-7xl lg:text-8xl'>
                      {getWeatherIcon(current.weather_code, current.is_day)}
                    </span>

                    <p className='text-6xl font-black leading-none text-white sm:text-7xl lg:text-8xl'>
                      {Math.round(current.temperature_2m)}°
                    </p>
                  </div>

                  <h2 className='mt-3 text-xl font-bold text-white sm:text-2xl'>
                    {weatherCodeText[current.weather_code] || 'Unknown weather'}
                  </h2>

                  <p className='mt-1 text-sm text-blue-100 sm:text-base'>
                    Feels like {Math.round(current.apparent_temperature)}°
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                  <WeatherInfo
                    icon={<Droplets size={21} />}
                    label='Humidity'
                    value={`${current.relative_humidity_2m}%`}
                    color='text-sky-200'
                  />

                  <WeatherInfo
                    icon={<Wind size={21} />}
                    label='Wind speed'
                    value={`${Math.round(current.wind_speed_10m)} km/h`}
                    color='text-violet-200'
                  />

                  <WeatherInfo
                    icon={<CloudRain size={21} />}
                    label='Precipitation'
                    value={`${current.precipitation} mm`}
                    color='text-blue-200'
                  />

                  <WeatherInfo
                    icon={current.is_day ? '☀️' : '🌙'}
                    label='Time'
                    value={current.is_day ? 'Day' : 'Night'}
                    color='text-yellow-200'
                  />
                </div>
              </div>
            </section>

            <section className='mt-5 min-h-0 flex-1 sm:mt-6 lg:mt-4'>
              <div className='mb-3 flex items-center gap-3'>
                <div className='rounded-xl border border-white/10 bg-white/10 p-2 text-fuchsia-200'>
                  <CalendarDays size={19} />
                </div>

                <h2 className='text-xl font-extrabold text-white sm:text-2xl'>
                  7-Day Forecast
                </h2>
              </div>

              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7'>
                {daily.time.map((date, index) => (
                  <ForecastCard
                    key={date}
                    date={index === 0 ? 'Today' : formatDay(date)}
                    icon={getWeatherIcon(daily.weather_code[index])}
                    status={
                      weatherCodeText[daily.weather_code[index]] || 'Unknown'
                    }
                    max={daily.temperature_2m_max[index]}
                    min={daily.temperature_2m_min[index]}
                    rain={daily.precipitation_probability_max?.[index]}
                  />
                ))}
              </div>
            </section>

            <section className='mt-4 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2'>
              <SunInfo
                icon={<Sunrise size={21} />}
                title='Sunrise'
                value={formatTime(daily.sunrise?.[0])}
              />

              <SunInfo
                icon={<Sunset size={21} />}
                title='Sunset'
                value={formatTime(daily.sunset?.[0])}
              />
            </section>
          </>
        )}

        <div className='mt-5 flex shrink-0 justify-center lg:mt-3'>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-blue-200/20 sm:w-auto lg:py-2.5'
          >
            <ArrowLeft size={20} />
            Change Location
          </button>
        </div>
      </div>
    </main>
  );
};

const WeatherInfo = ({ icon, label, value, color }) => {
  return (
    <article className='min-w-0 rounded-2xl border border-white/[0.08] bg-[#151b68]/35 p-3 shadow-lg sm:p-4'>
      <div className={`flex items-center gap-2 ${color}`}>
        {typeof icon === 'string' ? (
          <span className='text-lg'>{icon}</span>
        ) : (
          icon
        )}

        <span className='text-xs font-medium text-blue-100 sm:text-sm'>
          {label}
        </span>
      </div>

      <p className='mt-2 truncate text-base font-extrabold text-white sm:text-xl'>
        {value}
      </p>
    </article>
  );
};

const ForecastCard = ({ date, icon, status, max, min, rain }) => {
  return (
    <article className='group flex min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/[0.1] px-3 py-4 text-center shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.16] hover:shadow-[0_12px_30px_rgba(168,85,247,0.22)] sm:px-2 sm:py-3'>
      <p className='w-full truncate text-xs font-bold text-white sm:text-sm'>
        {date}
      </p>

      <div className='my-3 text-4xl transition duration-300 group-hover:scale-110'>
        {icon}
      </div>

      <p className='line-clamp-2 min-h-9 text-xs leading-4 text-blue-100/85'>
        {status}
      </p>

      <p className='mt-3 text-base font-extrabold text-white'>
        {Math.round(max)}°
        <span className='ml-1 text-blue-100/60'>{Math.round(min)}°</span>
      </p>

      {typeof rain === 'number' && (
        <p className='mt-1 text-xs text-sky-200'>Rain: {rain}%</p>
      )}
    </article>
  );
};

const SunInfo = ({ icon, title, value }) => {
  return (
    <article className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.1] p-3 shadow-lg backdrop-blur-md'>
      <div className='rounded-xl bg-orange-300/15 p-2 text-yellow-200'>
        {icon}
      </div>

      <div>
        <p className='text-xs text-blue-100/70'>{title}</p>
        <p className='mt-0.5 text-base font-extrabold text-white'>{value}</p>
      </div>
    </article>
  );
};

const LoadingCard = () => {
  return (
    <section className='rounded-3xl border border-white/10 bg-white/[0.1] px-6 py-16 text-center shadow-xl backdrop-blur-xl'>
      <div className='mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/25 border-t-white' />
      <p className='mt-5 text-lg font-semibold text-blue-100'>
        Loading live weather data...
      </p>
    </section>
  );
};

const ErrorCard = ({ children, onRetry }) => {
  return (
    <section className='rounded-3xl border border-red-300/25 bg-red-500/15 px-6 py-12 text-center shadow-xl backdrop-blur-xl'>
      <p className='text-lg font-semibold text-red-100'>{children}</p>

      <button
        type='button'
        onClick={onRetry}
        className='mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-bold text-white transition hover:bg-white/25'
      >
        <RefreshCw size={19} />
        Try Again
      </button>
    </section>
  );
};

export default Weather;
