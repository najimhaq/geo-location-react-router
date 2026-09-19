import { X } from 'lucide-react';
import { useState } from 'react';
import { getGeoLocation } from '../services/get-geoLocation';

const LocationModal = ({ onClose }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const location = city.trim();
    if (!location) {
      alert('Please enter a location.');
      return;
    }
    console.log(location);
    getGeoLocation(location)
      .then((coords) => {
        console.log('Coordinates:', coords);
        // You can use the coordinates here, e.g., pass them to a parent component or make another API call
      })
      .catch((error) => {
        console.error('Error fetching geolocation:', error);
        alert('City not found. Please try again.');
      });
    // onClose();
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const GEOLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
        { timeout: 10000 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
      <div className='relative w-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105'>
        {/* Close button */}
        <button
          type='button'
          className='absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-200 transition'
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className='text-3xl font-extrabold text-white mb-2 text-center'>
          🌍 Where are you located?
        </h2>
        <p className='text-gray-300 mb-6 text-center'>
          Please enter your location to get the latest weather updates.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            placeholder='Enter your location...'
            className='w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition'
            value={city}
            onChange={handleCityChange}
          />

          <button
            type='submit'
            className='w-full py-3 rounded-lg bg-fuchsia-600 text-white font-semibold shadow-md hover:bg-fuchsia-700 transition'
          >
            Get Weather
          </button>

          <button
            type='button'
            onClick={GEOLocation}
            className='w-full py-3 rounded-lg bg-fuchsia-500 text-white font-semibold shadow-md hover:bg-fuchsia-600 transition'
          >
            Use Current Location
          </button>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
