# Weather Report

A responsive student project that displays current weather conditions for cities around the world.

## Features
- Search for a city by name
- Quick-search buttons for popular cities
- Current temperature and feels-like temperature
- Weather description and icon
- Humidity, wind speed, and pressure
- Responsive layout for mobile and desktop
- Live data with no API key required

## Technologies
- HTML
- CSS
- JavaScript (Fetch API)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a browser. If your browser blocks requests from local files, use a simple local server such as VS Code Live Server.

## Publish with GitHub Pages
1. Create a public GitHub repository named `Weather-Report`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then click **Save**.
6. Wait for GitHub Pages to publish the site. Your URL will be `https://YOUR-GITHUB-USERNAME.github.io/Weather-Report/`.

## Notes
Weather data is provided by Open-Meteo. An internet connection is required. The app reports current conditions from the selected city's local time zone.
