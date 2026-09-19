# NextLevel Weather App

A modern, responsive weather dashboard built with React, Vite, Tailwind CSS, React Router, Lucide icons, and the Open-Meteo API.

The app lets users search any city or use their browser's current location to see live weather conditions, a 7-day forecast, humidity, wind speed, precipitation, sunrise, sunset, and timezone information.

## Live Features

- Search weather by city name
- Use the browser's current GPS location
- Reverse geocoding to display a city and country for the current location
- Current temperature and “feels like” temperature
- Humidity, wind speed, precipitation, and day/night status
- Seven-day weather forecast
- Sunrise and sunset times
- Responsive mobile, tablet, laptop, and desktop layouts
- Desktop dashboard layout designed to fit in the viewport
- Loading, API, permission, timeout, and network error handling
- Retry button when weather data cannot be loaded
- Selected location persisted in `sessionStorage` so refresh does not lose it
- Accessible modal behavior: focus, Escape-to-close, overlay click, and labelled controls

## Preview

### Main flow

```text
Home page
  ↓
Choose a city or use current location
  ↓
Get latitude and longitude
  ↓
Fetch weather data
  ↓
Responsive weather dashboard
```

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface and component state |
| Vite | Development server and production build tool |
| Tailwind CSS | Responsive styling and UI design |
| React Router DOM | Page routing and navigation |
| Lucide React | Modern SVG icons |
| Open-Meteo | Geocoding and weather forecast data |
| BigDataCloud | Client-side reverse geocoding for current location |
| Browser Geolocation API | User-approved device coordinates |
| sessionStorage | Persists the selected location during the browser session |

## Project Structure

```text
src/
├── components/
│   └── LocationModal.jsx
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Home.jsx
│   └── Weather.jsx
├── services/
│   ├── get-geo-location.js
│   ├── get-reverse-geo-location.js
│   └── get-weather.js
├── utils/
│   └── location-storage.js
├── App.jsx
├── index.css
└── main.jsx
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd weather-app
```

### 2. Install dependencies

```bash
npm install
npm install react-router-dom lucide-react
```

### 3. Start the development server

```bash
npm run dev
```

Vite will display a local URL, normally:

```text
http://localhost:5173
```

## Available Commands

```bash
# Start the local development server
npm run dev

# Create a production build
npm run build

# Preview the production build locally
npm run preview

# Run ESLint, if configured in the project
npm run lint
```

## How It Works

### 1. City search

When a user enters a city name, the application calls the Open-Meteo Geocoding API.

```text
City name → Open-Meteo Geocoding API → latitude/longitude → Weather API
```

Example request shape:

```text
https://geocoding-api.open-meteo.com/v1/search?name=Dhaka&count=1&language=en&format=json
```

### 2. Current location

When a user clicks **Use Current Location**, the browser asks for location permission.

```text
Browser Geolocation API → latitude/longitude
                         ↓
            BigDataCloud reverse geocoding
                         ↓
                  city and country name
                         ↓
                 Open-Meteo Weather API
```

If reverse geocoding fails, the application still opens the weather page using the device coordinates. The display name falls back to `Current Location`.

### 3. Weather forecast

The app requests current and daily weather fields from Open-Meteo.

Current weather data includes:

- Temperature
- Apparent temperature
- Humidity
- Wind speed
- Precipitation
- Weather code
- Day or night state

Daily forecast data includes:

- Weather condition
- Maximum temperature
- Minimum temperature
- Maximum rain probability
- Sunrise
- Sunset

## Responsive Design

The interface follows a mobile-first approach.

| Screen size | Layout behavior |
|---|---|
| Mobile | Two forecast cards per row and natural vertical scrolling |
| Small tablet | Three forecast cards per row |
| Tablet | Four forecast cards per row |
| Desktop | Seven forecast cards in one compact row |
| Large desktop | Dashboard-style layout within the viewport |

On smaller screens, vertical scrolling is intentional so no weather information is hidden. On desktop screens, the layout is compacted to avoid unnecessary outer scrolling.

## Error Handling

The application handles the following situations:

- Empty city input
- City not found
- Invalid API response
- Invalid coordinates
- Network connectivity problem
- Weather API failure
- Search timeout
- Reverse geocoding timeout
- Browser location permission denial
- Browser geolocation timeout
- Browser geolocation unavailable

Users see readable error messages instead of raw API errors, and the weather page provides a retry action.

## Location Persistence

The selected location is stored temporarily in browser session storage.

```js
sessionStorage.setItem('nextlevel-weather-location', JSON.stringify(location));
```

This means refreshing `/weather` will keep the last selected location during the current browser session. Closing the browser session typically clears this value.

## Important Notes

### HTTPS requirement for current location

The Browser Geolocation API generally works on:

- `http://localhost` during local development
- HTTPS domains in production

For deployed applications, use HTTPS. Geolocation may not work on a normal HTTP production URL.

### Public API use

The project uses public APIs. Before deploying a high-traffic commercial application, review the relevant API documentation, usage limits, fair-use policies, and terms of service.

### API key safety

The current APIs do not require a key for this project. If you later add an API that needs a secret key, do not place that secret in frontend React code. Use a backend server or serverless function instead.

## Common Troubleshooting

### `Failed to resolve import "react-router-dom"`

Install the required dependencies:

```bash
npm install react-router-dom lucide-react
```

### `Failed to resolve import "./App"` or `"./Router"`

Verify that your file name and import match exactly.

For this project, `main.jsx` should use:

```jsx
import App from './App';
```

And this file must exist:

```text
src/App.jsx
```

### Current location does not work

Check the following:

1. Allow location permission in your browser.
2. Use `localhost` during development or HTTPS after deployment.
3. Confirm your device location services are enabled.
4. Try the city search option as a fallback.

### The weather page is blank after refresh

Make sure `location-storage.js` is present and that `saveLocation()` is called before navigating to `/weather`.

## Future Improvements

- Hourly forecast chart
- Recent city search history
- Favorite locations
- Celsius/Fahrenheit unit switcher
- Dark/light theme switcher
- Weather animations based on live weather code
- Air-quality information
- Severe weather alerts
- PWA support for installation and offline shell caching
- Backend caching and rate limiting
- User authentication and saved weather preferences

## License

This project is created for learning and portfolio purposes. You can adapt it for your own projects.

---

Built with React, Tailwind CSS, Open-Meteo, and modern web APIs.
