import GeoPoint from "./GeoPoint";
import type GeoLocation from "./GeoLocation";
import type BoundingCoordinates from "./BoundingCoordinates";

export function calculateBoundingCoordinates(
  geoLocation: GeoLocation
): BoundingCoordinates {
  // Earth's radius in kilometers
  const EARTH_RADIUS_KM = 6371;

  const { lat, lng, radiusKm } = geoLocation;

  // An exceptionally large radius can cover the entire globe
  if (radiusKm >= EARTH_RADIUS_KM * Math.PI) {
    return {
      minLat: -90,
      maxLat: 90,
      minLng: -180,
      maxLng: 180,
    };
  }

  // Convert latitude and longitude from degrees to radians
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;

  // Calculate angular distance in radians
  const angularDistance = radiusKm / EARTH_RADIUS_KM;

  // Calculate min and max latitude in radians
  const minLatRad = latRad - angularDistance;
  const maxLatRad = latRad + angularDistance;

  let minLng: number;
  let maxLng: number;

  // Check if the search radius crosses a pole.
  if (maxLatRad > Math.PI / 2 || minLatRad < -Math.PI / 2) {
    // If the circle includes a pole, the longitude spans the entire range
    minLng = -180;
    maxLng = 180;
  } else {
    // Calculate longitude bounds
    const deltaLng = Math.asin(Math.sin(angularDistance) / Math.cos(latRad));
    const minLngRad = lngRad - deltaLng;
    const maxLngRad = lngRad + deltaLng;

    // Convert longitude bounds back to degrees
    minLng = (minLngRad * 180) / Math.PI;
    maxLng = (maxLngRad * 180) / Math.PI;
  }

  // Convert latitude bounds back to degrees and clamp to range [-90, 90]
  const minLat = Math.max((minLatRad * 180) / Math.PI, -90);
  const maxLat = Math.min((maxLatRad * 180) / Math.PI, 90);

  // Correct rounding errors and return
  return {
    minLat: parseFloat(minLat.toFixed(6)),
    maxLat: parseFloat(maxLat.toFixed(6)),
    minLng: parseFloat(minLng.toFixed(6)),
    maxLng: parseFloat(maxLng.toFixed(6)),
  };
}

// No changes needed for the function below
export function isPointWithinBounds(
  geoPoint?: GeoPoint,
  geoLocation?: GeoLocation
) {
  if (!geoPoint || !geoLocation) return false;
  const latitude = geoLocation.lat;
  console.log("isPointWithinBounds latitude", latitude);
  const longitude = geoLocation.lng;
  console.log("isPointWithinBounds longitude", longitude);

  const radiusKm = geoLocation.radiusKm;

  const { minLat, maxLat, minLng, maxLng } = calculateBoundingCoordinates({
    lat: latitude,
    lng: longitude,
    radiusKm,
  });

  const { latitude: pointLat, longitude: pointLng } = geoPoint;
  return (
    pointLat >= minLat &&
    pointLat <= maxLat &&
    pointLng >= minLng &&
    pointLng <= maxLng
  );
}
