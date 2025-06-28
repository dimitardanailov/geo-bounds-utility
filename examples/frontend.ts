import { calculateBoundingCoordinates } from "../src/index.js";

const location = {
  lat: 40.7128,
  lng: -74.006,
  radiusKm: 10,
};

const bounds = calculateBoundingCoordinates(location);

console.log("Frontend-compatible bounds:", bounds);
