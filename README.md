# 🌤️ Modern Weather App

A fast, responsive, and intuitive Weather Application built with **React**, **React Router**, and **Tailwind CSS**. This app allows users to search for cities worldwide and view real-time weather details, daily forecasts, and geographical insights.

---

## ✨ Features

- 🔍 **City Search & Geocoding:** Search for any city globally with real-time location lookup.
- 🌡️ **Current Weather & Forecast:** View temperature, weather conditions, wind speed, humidity, and more.
- 📱 **Fully Responsive:** Styled using Tailwind CSS to look great on desktop, tablet, and mobile devices.
- 🗺️ **Multi-page Navigation:** Smooth client-side routing powered by **React Router**.
- ⚡ **Lightweight & Fast:** Built using modern APIs without unnecessary overhead.

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Routing:** React Router (`v6+`)
- **Styling:** Tailwind CSS
- **API:** Open-Meteo Geocoding & Weather API (or your chosen provider)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

---

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components (Navbar, WeatherCard, SearchBar, etc.)
├── pages/           # Page routes (Home, WeatherDetail, About, NotFound)
├── services/        # API functions (getGeoLocation, getWeather, etc.)
├── App.jsx          # Main application component & Router configuration
├── index.css        # Tailwind CSS imports
└── main.jsx         # App entry point
```

---

## 🛣️ Routes Overview

| Route | Description |
|---|---|
| `/` | Home page with search bar and featured/saved locations |
| `/weather/:city` | Detailed weather report for the specified city |
| `*` | 404 page for invalid routes |

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
