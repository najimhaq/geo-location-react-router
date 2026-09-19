export const getGeoLocation = async (city) => {
  if (typeof city !== 'string' || !city.trim()) {
    throw new Error('A valid city name is required.');
  }

  const cleanCity = city.trim();

  const params = new URLSearchParams({
    name: cleanCity,
    count: '1',
    language: 'en',
    format: 'json',
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`,
      {
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`City search failed (${response.status}).`);
    }

    const data = await response.json();
    const place = data?.results?.[0];

    if (!place) {
      throw new Error(`No location found for "${cleanCity}".`);
    }

    if (!Number.isFinite(place.latitude) || !Number.isFinite(place.longitude)) {
      throw new Error('The selected city has invalid coordinates.');
    }

    return {
      name: place.name || cleanCity,
      country: place.country || '',
      countryCode: place.country_code || '',
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone || '',
      isCurrentLocation: false,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('City search timed out. Please try again.', { cause: error });
    }

    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your internet connection.', { cause: error });
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
