const STORAGE_KEY = 'nextlevel-weather-location';

export const saveLocation = (location) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.warn('Could not save weather location:', error);
  }
};

export const getSavedLocation = () => {
  try {
    const savedValue = sessionStorage.getItem(STORAGE_KEY);

    if (!savedValue) {
      return null;
    }

    const location = JSON.parse(savedValue);

    if (
      !location ||
      !Number.isFinite(Number(location.latitude)) ||
      !Number.isFinite(Number(location.longitude))
    ) {
      return null;
    }

    return {
      ...location,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    };
  } catch (error) {
    console.warn('Could not read saved weather location:', error);
    return null;
  }
};

export const clearSavedLocation = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear weather location:', error);
  }
};
