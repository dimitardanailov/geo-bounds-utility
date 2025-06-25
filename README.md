# Geo Bounds Utility

A TypeScript utility to compute bounding coordinates for a geolocation and determine if a point lies within those bounds. Useful for geospatial filtering without expensive distance calculations.

## Installation

```bash
npm install geo-bounds-utility
```

## Usage

The package exports two main functions and related types:

```typescript
import {
  calculateBoundingCoordinates,
  isPointWithinBounds,
  GeoPoint,
  type GeoLocation,
  type BoundingCoordinates,
} from "geo-bounds-utility";
```

### GeoLocation

A `GeoLocation` object defines a circular area.

```typescript
type GeoLocation = {
  lat: number; // Latitude of the center
  lng: number; // Longitude of the center
  radiusKm: number; // Radius in kilometers
  name?: string; // Optional name
};
```

### GeoPoint

A `GeoPoint` represents a specific point with latitude and longitude.

```typescript
class GeoPoint {
  constructor(latitude: number, longitude: number);
  readonly latitude: number;
  readonly longitude: number;
  isEqual(other: GeoPoint): boolean;
}
```

## calculateBoundingCoordinates(location: GeoLocation): BoundingCoordinates

Returns the bounding box (in degrees) that encloses a circular area defined by a center and radius.

```typescript
import { calculateBoundingCoordinates } from "geo-bounds-utility";

const bounds = calculateBoundingCoordinates({
  lat: 40.7128,
  lng: -74.006,
  radiusKm: 10,
});

// {
//   minLat: 40.622867,
//   maxLat: 40.802733,
//   minLng: -74.120694,
//   maxLng: -73.891306
// }
```

## isPointWithinBounds(geoPoint?: GeoPoint, geoLocation?: GeoLocation): boolean

Determines if a GeoPoint (from `firebase-admin`) falls within the bounding box defined by a GeoLocation.

```typescript
import { GeoPoint } from "firebase-admin/firestore";
import { isPointWithinBounds } from "your-package";

const point = new GeoPoint(40.713, -74.007);
const center = { lat: 40.7128, lng: -74.006, radiusKm: 10 };

const inside = isPointWithinBounds(point, center); // true
```

### Development

To build and test the project:

```bash
npm install
npm run build
npm run test
```
