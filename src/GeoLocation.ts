/**
 * A geospatial object representing a circular area on the Earth's surface.
 *
 * Defined by a central point (latitude and longitude) and a radius in kilometers.
 *
 * Latitude values must be in the range [-90, 90].
 * Longitude values must be in the range [-180, 180].
 * Radius should be >= 0 and represents distance from the center point.
 *
 * Optional `name` field is for debugging or metadata purposes only.
 */
type GeoLocation = {
  lat: number;
  lng: number;
  name?: string;
  radiusKm: number;
};

export default GeoLocation;
