# Geo Bounds Utility

A TypeScript utility to compute bounding coordinates for a geolocation and determine if a point lies within those bounds. Useful for geospatial filtering without expensive distance calculations.

## Installation

```bash
npm install geo-bounds-utility
```

### Types

```typescript
type GeoLocation = {
  lat: number;
  lng: number;
  name?: string;
  radiusKm: number;
};

type BoundingCoordinates = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};
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
```

## isPointWithinBounds(geoPoint?: GeoPoint, geoLocation?: GeoLocation): boolean

Determines if a GeoPoint (from `firebase-admin`) falls within the bounding box defined by a GeoLocation.

```typescript
import { GeoPoint } from "firebase-admin/firestore";
import { isPointWithinBounds } from "your-package";

const point = new GeoPoint(40.713, -74.007);
const center = { lat: 40.7128, lng: -74.006, radiusKm: 10 };

const inside = isPointWithinBounds(point, center);
// true or false
```
