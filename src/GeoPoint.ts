/**
 * An immutable object representing a geo point in Firestore. The geo point
 * is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */
export class GeoPoint {
  /**
   * Creates a new immutable GeoPoint object with the provided latitude and
   * longitude values.
   * @param latitude The latitude as number between -90 and 90.
   * @param longitude The longitude as number between -180 and 180.
   */
  constructor(latitude: number, longitude: number) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new TypeError("Latitude and longitude must be numbers.");
    }
    if (latitude < -90 || latitude > 90) {
      throw new RangeError("Latitude must be between -90 and 90.");
    }
    if (longitude < -180 || longitude > 180) {
      throw new RangeError("Longitude must be between -180 and 180.");
    }

    this.latitude = latitude;
    this.longitude = longitude;
  }

  readonly latitude: number;
  readonly longitude: number;
}

export default GeoPoint;
