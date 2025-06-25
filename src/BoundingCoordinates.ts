/**
 * Represents a rectangular bounding box on the Earth's surface.
 *
 * All coordinates are in decimal degrees.
 * Latitude values range between -90 and 90.
 * Longitude values range between -180 and 180.
 *
 * Typically used to define the boundaries of a circular area
 * after converting a center point + radius into a bounding box.
 */
type BoundingCoordinates = {
  /** Minimum latitude (south edge of the box) */
  minLat: number;

  /** Maximum latitude (north edge of the box) */
  maxLat: number;

  /** Minimum longitude (west edge of the box) */
  minLng: number;

  /** Maximum longitude (east edge of the box) */
  maxLng: number;
};

export default BoundingCoordinates;
