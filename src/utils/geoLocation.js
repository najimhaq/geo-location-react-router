export const getGeoLocation = (city) => {

    if(!city || typeof city !== 'string' || city.trim() === '') {
        return Promise.reject(new Error('Valid city name is required.'));
    }

    const cleanCity = city.trim();
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`;

    // Set a timeout for the fetch request (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    return fetch(url, { signal: controller.signal })
        .then((response) => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!Array.isArray(data.results) || data.results.length === 0) {
                throw new Error(`No geographic location found for "${cleanCity}"`);
            }
            const place = data.results[0];
            if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number') {
                throw new Error('Invalid geocoding response structure');
            }
            return {
                name: String(place.name ?? ''),
                country: String(place.country ?? ''),
                countryCode: String(place.country_code ?? ''),
                latitude: place.latitude,
                longitude: place.longitude,
                timezone: String(place.timezone ?? ''),
            };
        })
        .catch((error) => {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Geocoding request timed out', { cause: error });
            }
            throw error;
        });
};
