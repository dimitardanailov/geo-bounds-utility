import {
  calculateBoundingCoordinates,
  isPointWithinBounds,
  GeoPoint,
} from "../src/index.js";

// Simulate coordinates (NYC area)
const center = {
  lat: 40.7128,
  lng: -74.006,
  radiusKm: 10,
};

const point = new GeoPoint(40.713, -74.007);

const bounds = calculateBoundingCoordinates(center);
const inside = isPointWithinBounds(point, center);

console.log("Backend-compatible bounds:", bounds);
console.log("Point inside bounds:", inside);
