export const getWeather = async ({ latitude, longitude, signal }) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Valid latitude and longitude are required.');
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error(`Weather service failed (${response.status}).`);
    }

    const data = await response.json();

    if (!data?.current || !data?.daily) {
      throw new Error('Weather data is temporarily unavailable.');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection.', { cause: error });
    }

    throw error;
  }
};
