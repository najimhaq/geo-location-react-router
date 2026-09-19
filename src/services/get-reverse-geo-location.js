export const getReverseGeoLocation = async (latitude, longitude) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Valid location coordinates are required.');
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'en',
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`,
      {
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed (${response.status}).`);
    }

    const data = await response.json();

    const name =
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      'Current Location';

    return {
      name,
      country: data.countryName || '',
      countryCode: data.countryCode || '',
      latitude,
      longitude,
      timezone: '',
      isCurrentLocation: true,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Location name request timed out.', { cause: error });
    }

    if (error instanceof TypeError) {
      throw new Error('Could not connect to the location service.', { cause: error });
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
