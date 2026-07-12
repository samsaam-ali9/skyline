# 🌤 Skyline — Interactive Weather Application

A premium, glassmorphic weather dashboard built with plain HTML, CSS, and JavaScript. Search any city and see its live temperature, conditions, and sky — with the entire interface shifting its theme to match the weather.

> Built for the **DevRise Internship Program — Batch 1 (2026), Task 2: Interactive Weather Application**.

---

## 📖 Project Overview

Skyline is a responsive, single-page weather dashboard that fetches real-time data from the OpenWeatherMap API. It was built to satisfy the DevRise Task 2 brief end-to-end: live API integration, async/await data fetching, robust error handling, and a dynamic UI that visually reacts to current conditions — all without any framework or library.

## ✨ Features

- **Search by city name**, with a submit button or the Enter key
- **Full weather detail set**: city, country, temperature, feels-like, humidity, wind speed, description, weather icon, pressure, visibility, sunrise, and sunset
- **Live digital clock** and full current date
- **Animated loading spinner** while data is in flight, with the search button disabled to prevent duplicate requests
- **Graceful error states** (no `alert()`) for empty searches, unknown cities, network failures, and API errors, each with a retry action
- **Dynamic theming** — background, gradient, and accent colors shift for clear skies, clouds, rain, thunderstorms, snow, mist/fog, and night
- **Ambient particle effects** — soft rain streaks or falling snow layered behind the interface depending on conditions
- **Sunrise → sunset progress track** showing where the current time sits in the daylight window
- **Remembers your last searched city** using `localStorage` and loads it automatically on return visits
- **Auto-focused search input** on page load
- **Fade-in animations** for the weather card and a subtle floating animation on the weather icon
- Fully **responsive** across desktop, laptop, tablet, and mobile
- **Accessible**: semantic HTML, labeled form controls, `aria-live` regions for state changes, visible keyboard focus rings, and `prefers-reduced-motion` support

## 🛠 Technologies Used

- **HTML5** — semantic structure only, no inline CSS/JS
- **CSS3** — custom properties, Flexbox, Grid, media queries, keyframe animations, glassmorphism (backdrop-filter)
- **Vanilla JavaScript (ES6+)** — `const`/`let`, arrow functions, template literals, destructuring, `async`/`await`, `fetch()`, `try/catch`, `DOMContentLoaded`

No React, Vue, Angular, jQuery, TypeScript, Bootstrap, or Tailwind is used anywhere in this project.

## 🌐 API Used

**[OpenWeatherMap — Current Weather Data API](https://openweathermap.org/current)**

```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={API_KEY}
```

The API key is stored in a single constant at the top of `script.js`:

```js
const OPENWEATHER_API_KEY = '495b9131505a51c58607df3667610c3a';
```

The application currently uses a valid OpenWeatherMap API key. If needed, you can replace it with your own free API key by editing the OPENWEATHER_API_KEY constant in script.js.

## 📁 Folder Structure

```
weather-app/
│
├── index.html          # Semantic markup and page structure
├── style.css            # All styling — variables, themes, layout, animations
├── script.js             # App logic — fetching, rendering, state, theming
├── README.md            # This file
└── assets/
    ├── images/          # Reserved for screenshots / demo images
    └── icons/            # Reserved for any custom icon assets
```

## 🚀 How to Run

1. Clone or download this repository.
2. (Optional) Replace the OpenWeatherMap API key in script.js with your own.
3. Open `index.html` directly in a browser, **or** serve the folder locally for the best experience:

   ```bash
   npx serve .
   # or
   python3 -m http.server 5500
   ```

4. Search for any city and press Enter or click **Search**.

No build step, no package installation, and no dependencies are required.

## 📸 Screenshots

_Add screenshots of the search state, a successful result, the loading spinner, and an error card here before submission._

| Search | Result | Loading | Error |
|---|---|---|---|
| _add image_ | _add image_ | _add image_ | _add image_ |

## 🔗 Live Demo

`[Add your GitHub Pages / Netlify / Vercel URL here]`

## 📦 Repository

`[Add your public GitHub repository link here]`

## 👤 Author

`SAMSAAM ALI` — DevRise Internship Program, Batch 1 (2026)

## 📄 License

This project is submitted as coursework for the DevRise Internship Program and is free to use for learning purposes.
