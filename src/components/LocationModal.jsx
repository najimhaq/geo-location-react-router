import { Crosshair, MapPin, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGeoLocation } from '../services/get-geo-location';
import { getReverseGeoLocation } from '../services/get-reverse-geo-location';
import { saveLocation } from '../utils/location-storage';

const LocationModal = ({ onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    inputRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !loading && !geoLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [geoLoading, loading, onClose]);

  const goToWeatherPage = (location) => {
    const normalizedLocation = {
      name: location.name || 'Unknown location',
      country: location.country || '',
      countryCode: location.countryCode || '',
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      timezone: location.timezone || '',
      isCurrentLocation: Boolean(location.isCurrentLocation),
    };

    if (
      !Number.isFinite(normalizedLocation.latitude) ||
      !Number.isFinite(normalizedLocation.longitude)
    ) {
      setError('Invalid location coordinates. Please try again.');
      return;
    }

    saveLocation(normalizedLocation);

    // Modal close হবে এবং route change হবে।
    onClose();

    navigate('/weather', {
      state: {
        location: normalizedLocation,
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanCity = city.trim();

    if (!cleanCity) {
      setError('Please enter a city name.');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const location = await getGeoLocation(cleanCity);
      goToWeatherPage(location);
    } catch (err) {
      console.error('City search error:', err);
      setError(err.message || 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setGeoLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          const location = await getReverseGeoLocation(latitude, longitude);

          goToWeatherPage({
            ...location,
            latitude,
            longitude,
            isCurrentLocation: true,
          });
        } catch (err) {
          console.error('Reverse geocoding error:', err);

          // City name না পেলেও coordinates দিয়ে Weather page open হবে।
          goToWeatherPage({
            name: 'Current Location',
            country: '',
            latitude,
            longitude,
            timezone: '',
            isCurrentLocation: true,
          });
        } finally {
          setGeoLoading(false);
        }
      },
      (geoError) => {
        console.error('Browser geolocation error:', geoError);

        const messages = {
          1: 'Location permission was denied. Please allow location access.',
          2: 'Your current location is unavailable. Try again shortly.',
          3: 'Location request timed out. Please try again.',
        };

        setError(messages[geoError.code] || 'Unable to get your location.');
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const isBusy = loading || geoLoading;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#050b1d]/75 px-4 py-6 backdrop-blur-md'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isBusy) {
          onClose();
        }
      }}
      role='presentation'
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='location-modal-title'
        className='relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#152452]/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8'
      >
        <div className='pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/25 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl' />

        <button
          type='button'
          onClick={onClose}
          disabled={isBusy}
          className='absolute right-4 top-4 z-10 rounded-xl p-2 text-blue-100 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
          aria-label='Close location selector'
        >
          <X size={22} />
        </button>

        <div className='relative'>
          <div className='mb-5 inline-flex rounded-2xl bg-gradient-to-br from-blue-500/30 to-fuchsia-500/30 p-3 text-yellow-200'>
            <MapPin size={28} />
          </div>

          <h2
            id='location-modal-title'
            className='pr-8 text-2xl font-extrabold text-white sm:text-3xl'
          >
            Choose your location
          </h2>

          <p className='mt-2 text-sm leading-6 text-blue-100/80 sm:text-base'>
            Search for a city, or let your browser use your current location.
          </p>

          {error && (
            <div
              role='alert'
              className='mt-5 rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100'
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            <label htmlFor='city-input' className='sr-only'>
              City name
            </label>

            <div className='relative'>
              <Search
                size={20}
                className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/60'
              />

              <input
                ref={inputRef}
                id='city-input'
                type='text'
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setError('');
                }}
                placeholder='Dhaka, Seoul, London...'
                disabled={isBusy}
                autoComplete='off'
                className='w-full rounded-2xl border border-white/15 bg-[#091532]/80 py-3.5 pl-12 pr-4 text-white outline-none placeholder:text-blue-100/45 transition focus:border-fuchsia-300/60 focus:ring-4 focus:ring-fuchsia-400/15 disabled:cursor-not-allowed disabled:opacity-60'
              />
            </div>

            <button
              type='submit'
              disabled={isBusy || !city.trim()}
              className='flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-600 px-5 py-3.5 font-bold text-white shadow-lg transition hover:from-blue-400 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Search size={19} />
              {loading ? 'Searching city...' : 'Get Weather'}
            </button>

            <div className='flex items-center gap-3 py-1 text-xs text-blue-100/50'>
              <span className='h-px flex-1 bg-white/10' />
              OR
              <span className='h-px flex-1 bg-white/10' />
            </div>

            <button
              type='button'
              onClick={handleUseCurrentLocation}
              disabled={isBusy}
              className='flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-300/25 bg-blue-400/10 px-5 py-3.5 font-bold text-blue-50 transition hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Crosshair size={20} />
              {geoLoading ? 'Detecting location...' : 'Use Current Location'}
            </button>
          </form>

          <p className='mt-5 text-center text-xs leading-5 text-blue-100/55'>
            Your browser will ask for permission before sharing your location.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LocationModal;
