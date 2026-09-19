export const getGeoLocation = async (city) => {
  // 1. Input validation
  if (typeof city !== 'string' || city.trim() === '') {
    throw new Error('Valid city name is required.');
  }

  const cleanCity = city.trim();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`;

  // 2. Timeout setup (5 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    // 3. Fetch with timeout
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Geocoding API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // 4. Validate response structure
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error(`No geographic location found for "${cleanCity}"`);
    }

    const place = data.results[0];

    // 5. Type-check critical fields
    if (
      typeof place.latitude !== 'number' ||
      typeof place.longitude !== 'number'
    ) {
      throw new Error('Invalid geocoding response structure');
    }

    // 6. Return clean payload
    return {
      name: String(place.name ?? ''),
      country: String(place.country ?? ''),
      countryCode: String(place.country_code ?? ''),
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: String(place.timezone ?? ''),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout explicitly
    if (error.name === 'AbortError') {
      throw new Error('Geocoding request timed out', { cause: error });
    }

    // Re-throw for caller to handle
    throw error;
  }
};


