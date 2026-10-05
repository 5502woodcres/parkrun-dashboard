#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const COURSE_COORDS = {
  'Albert Park': { lat: -37.8412, lng: 144.9629, location: 'Melbourne, VIC' },
  'Beaumaris Beach': { lat: -37.9953, lng: 145.1032, location: 'Beaumaris, VIC' },
  'Cascades': { lat: -37.8295, lng: 145.2995, location: 'Dandenong, VIC' },
  'Dandenong': { lat: -37.9879, lng: 145.3299, location: 'Dandenong, VIC' },
  'Emerald Lake': { lat: -37.9345, lng: 145.3878, location: 'Emerald, VIC' },
  'Fairfield': { lat: -37.7879, lng: 145.0159, location: 'Fairfield, VIC' },
  'Glenroy': { lat: -37.7451, lng: 144.9332, location: 'Glenroy, VIC' },
  'Heathmont': { lat: -37.8432, lng: 145.2295, location: 'Heathmont, VIC' },
  'Ivanhoe': { lat: -37.7698, lng: 145.0876, location: 'Ivanhoe, VIC' },
  'Jells Park': { lat: -37.8129, lng: 145.2546, location: 'Wheelers Hill, VIC' },
  'Kew': { lat: -37.7912, lng: 145.0546, location: 'Kew, VIC' },
  'Lake Burrumbeet': { lat: -37.2156, lng: 143.5234, location: 'Lake Burrumbeet, VIC' }
};

const USER_LOCATIONS = {
  flat: { name: 'Flat (W12 7GR)', lat: 51.5045, lng: -0.2226 },
  work: { name: 'Work (Charterhouse St)', lat: 51.5202, lng: -0.0982 }
};

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const sampleData = {
  "lisa": {
    "athleteId": "a3934942",
    "name": "Lisa",
    "courses": [
      { "name": "Albert Park", "letter": "A", "date": "2024-01-06" },
      { "name": "Beaumaris Beach", "letter": "B", "date": "2024-01-13" },
      { "name": "Cascades", "letter": "C", "date": "2024-01-20" },
      { "name": "Dandenong", "letter": "D", "date": "2024-01-27" },
      { "name": "Emerald Lake", "letter": "E", "date": "2024-02-03" },
      { "name": "Fairfield", "letter": "F", "date": "2024-02-10" },
      { "name": "Glenroy", "letter": "G", "date": "2024-02-17" },
      { "name": "Heathmont", "letter": "H", "date": "2024-02-24" }
    ]
  },
  "beth": {
    "athleteId": "a2475659",
    "name": "Beth",
    "courses": [
      { "name": "Albert Park", "letter": "A", "date": "2024-01-06" },
      { "name": "Cascades", "letter": "C", "date": "2024-01-13" },
      { "name": "Dandenong", "letter": "D", "date": "2024-01-20" },
      { "name": "Emerald Lake", "letter": "E", "date": "2024-01-27" },
      { "name": "Fairfield", "letter": "F", "date": "2024-02-03" },
      { "name": "Jells Park", "letter": "J", "date": "2024-02-10" },
      { "name": "Kew", "letter": "K", "date": "2024-02-17" }
    ]
  }
};

Object.keys(sampleData).forEach(athlete => {
  sampleData[athlete].courses = sampleData[athlete].courses.map(course => {
    const coords = COURSE_COORDS[course.name] || { lat: null, lng: null, location: 'Unknown' };
    return { ...course, ...coords, distances: { toFlat: coords.lat ? calculateDistance(USER_LOCATIONS.flat.lat, USER_LOCATIONS.flat.lng, coords.lat, coords.lng) : null, toWork: coords.lat ? calculateDistance(USER_LOCATIONS.work.lat, USER_LOCATIONS.work.lng, coords.lat, coords.lng) : null } };
  });
});

fs.writeFileSync(path.join(__dirname, 'parkrun-data.json'), JSON.stringify(sampleData, null, 2));
console.log('✓ Data updated to parkrun-data.json');
