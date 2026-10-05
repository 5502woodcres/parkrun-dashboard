# Parkrun Alphabet Challenge Dashboard

Real-time tracker for the Parkrun Alphabet Challenge between Lisa and Beth.

## Features

- **Live Alphabet Grid** — Track A-Z completion with color coding
- **Stats Dashboard** — Letter counts and overall progress
- **Export** — CSV and JSON export for analysis
- **Responsive Design** — Works on desktop and mobile

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Data

```bash
npm run scrape
```

### 3. Start Dashboard

```bash
npm run serve
```

Open http://localhost:8080/dashboard.html

## Files

- `scraper.js` — Fetches and enriches parkrun data
- `dashboard.html` — Full dashboard interface
- `parkrun-data.json` — Generated data file

## Athlete IDs

- **Lisa**: a3934942
- **Beth**: a2475659

## Locations

- **Flat**: 5 Wood Crescent, London W12 7GR
- **Work**: 33 Charterhouse Street, London

## Live Dashboard

View the live dashboard at: https://richbrostoluk.github.io/parkrun-dashboard/dashboard.html

## License

MIT
