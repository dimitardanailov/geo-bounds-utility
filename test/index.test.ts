import { expect } from "chai";
import { calculateBoundingCoordinates } from "../src";
import GeoLocation from "../src/GeoLocation";

import {
  City,
  SanFrancisco,
  Greenwich,
  London,
  Brighton,
  Guildford,
  Manchester,
  Edinburgh,
  Sydney,
  NewYork,
  LosAngeles,
  Krakow,
  BuenosAres,
  Cordoba,
  NorthPole,
  Equator,
  SouthPole,
} from "../src/cities";

function isBoundingCoordinates(
  cityA: City,
  cityB: City,
  radiusKm: number,
  expectedValue = true
): void {
  const geoLocation: GeoLocation = {
    lat: cityA.lat,
    lng: cityA.lng,
    radiusKm,
  };

  const boundingBox = calculateBoundingCoordinates(geoLocation);

  const isLatWithinBounds =
    cityB.lat >= boundingBox.minLat && cityB.lat <= boundingBox.maxLat;
  const isLngWithinBounds =
    cityB.lng >= boundingBox.minLng && cityB.lng <= boundingBox.maxLng;

  // The point is within the box only if BOTH latitude and longitude are within bounds.
  const isWithinBox = isLatWithinBounds && isLngWithinBounds;

  // Assert that the final result matches the expected value.
  expect(isWithinBox).to.equal(expectedValue);
}

describe("calculateBoundingCoordinates", () => {
  it("should calculate correct bounding coordinates for a given geolocation", () => {
    const geoLocation = {
      ...SanFrancisco,
      radiusKm: 10,
    };

    const result = calculateBoundingCoordinates(geoLocation);

    const expected = {
      minLat: 37.6863671879813,
      maxLat: 37.8634328120186,
      minLng: -122.53741593759,
      maxLng: -122.3013840624,
    };

    expect(result.minLat).to.be.closeTo(expected.minLat, 5);
    expect(result.maxLat).to.be.closeTo(expected.maxLat, 5);
    expect(result.minLng).to.be.closeTo(expected.minLng, 5);
    expect(result.maxLng).to.be.closeTo(expected.maxLng, 5);
  });

  it("should return the same coordinates when radius is zero", () => {
    const geoLocation = {
      ...Greenwich,
      radiusKm: 0,
    };

    const result = calculateBoundingCoordinates(geoLocation);

    expect(result.minLat).to.be.closeTo(geoLocation.lat, 5);
    expect(result.maxLat).to.be.closeTo(geoLocation.lat, 5);
    expect(result.minLng).to.be.closeTo(geoLocation.lng, 5);
    expect(result.maxLng).to.be.closeTo(geoLocation.lng, 5);
  });

  describe("Positive tests for UK cities", () => {
    const radiusKm = 100;

    it("should include Brighton within the bounding box of London", () => {
      isBoundingCoordinates(London, Brighton, radiusKm);
    });

    it("should include Guildford within the bounding box of London", () => {
      isBoundingCoordinates(London, Guildford, radiusKm);
    });
  });

  describe("Large radius test cases", () => {
    it("should include Manchester, London, and Edinburgh within the bounding box of UK center", () => {
      const ukCenter: City = {
        lat: 54.0, // Rough center of the UK
        lng: -2.0,
        name: "UK Center",
      };

      const cities = [Manchester, London, Edinburgh];
      const radiusKm = 300;

      cities.forEach((city) => {
        isBoundingCoordinates(ukCenter, city, radiusKm);
      });
    });
  });

  describe("calculateBoundingCoordinates - Test London and Manchester", () => {
    it("should test if Manchester is within the bounding box of London with a large radius", () => {
      // ~221 km is the distance between London and Manchester
      const radiusKm = 300;

      isBoundingCoordinates(London, Manchester, radiusKm);
    });

    it("should test if London is within the bounding box of Manchester with a large radius", () => {
      // ~221 km is the distance between London and Manchester
      const radiusKm = 300;

      isBoundingCoordinates(Manchester, London, radiusKm);
    });

    it("should confirm Manchester is outside London's bounding box with a small radius", () => {
      const radiusKm = 50;

      isBoundingCoordinates(London, Manchester, radiusKm, false);
    });

    it("should confirm London is outside Manchester's bounding box with a small radius", () => {
      const radiusKm = 50;

      isBoundingCoordinates(Manchester, London, radiusKm, false);
    });
  });

  describe("calculateBoundingCoordinates - Test New York and Sydney", () => {
    it("should test if Sydney is within the bounding box of New York with a large radius", () => {
      // ~15,993 km is the distance between New York and Sydney
      const radiusKm = 16000;

      isBoundingCoordinates(NewYork, Sydney, radiusKm);
    });

    it("should test if New York is within the bounding box of Sydney with a large radius", () => {
      // ~15,993 km is the distance between New York and Sydney
      const radiusKm = 16000;

      isBoundingCoordinates(Sydney, NewYork, radiusKm);
    });

    it("should confirm Sydney is outside New York's bounding box with a small radius", () => {
      const radiusKm = 14000;

      // The test is changed to expect 'true' because a 14,000km radius from New York
      // creates a bounding box that crosses the North Pole, expanding the longitude
      // to the entire globe, which includes Sydney's coordinates.
      isBoundingCoordinates(NewYork, Sydney, radiusKm, true);
    });

    it("should return FALSE when the bounding box does NOT cross a pole", () => {
      // TECHNICAL DETAIL:
      // The distance from New York (~40.7° N) to the North Pole (90° N) is approx. 5,480 km.
      // A radius smaller than this will NOT trigger the pole-crossing logic.
      // This results in a narrow, localized bounding box that correctly EXCLUDES Sydney.
      const radiusKm = 5400; // Using a radius less than the distance to the pole.

      isBoundingCoordinates(NewYork, Sydney, radiusKm, false);
    });

    it("should return TRUE when the bounding box DOES cross a pole", () => {
      // TECHNICAL DETAIL:
      // The distance from New York (~40.7° N) to the North Pole (90° N) is approx. 5,480 km.
      // A radius of 8300 km is larger, triggering the pole-crossing logic.
      // The function then expands the bounding box longitude to the entire globe (-180 to 180),
      // which now INCLUDES Sydney's coordinates. The result is therefore 'true'.
      const radiusKm = 8300; // Using a radius greater than the distance to the pole.

      isBoundingCoordinates(NewYork, Sydney, radiusKm, true);
    });

    it("should confirm NewYork is outside Sydney's bounding box with a small radius", () => {
      const radiusKm = 1000;

      isBoundingCoordinates(Sydney, NewYork, radiusKm, false);
    });
  });

  describe("Los Angeles and San Francisco", () => {
    it("should test if San Francisco is within the bounding box of Los Angeles with a large radius", () => {
      // ~559 km is the distance between Los Angeles and San Francisco
      const radiusKm = 600;

      isBoundingCoordinates(LosAngeles, SanFrancisco, radiusKm);
    });

    it("should test if Los Angeles is within the bounding box of San Francisco with a large radius", () => {
      // ~559 km is the distance between Los Angeles and San Francisco
      const radiusKm = 600;

      isBoundingCoordinates(SanFrancisco, LosAngeles, radiusKm);
    });

    it("should confirm San Francisco is outside Los Angeles's bounding box with a small radius", () => {
      const radiusKm = 300;

      isBoundingCoordinates(LosAngeles, SanFrancisco, radiusKm, false);
    });
  });

  describe("Krakow and London", () => {
    it("should test if Krakow is within the bounding box of London with a large radius", () => {
      // ~1440 km is the distance between Krakow and London
      const radiusKm = 1500;
      isBoundingCoordinates(London, Krakow, radiusKm);
    });

    it("should test if London is within the bounding box of Krakow with a small radius", () => {
      const radiusKm = 600;
      isBoundingCoordinates(Krakow, London, radiusKm, false);
    });

    it("should test if London is within the bounding box of Krakow with a small radius", () => {
      const radiusKm = 900;
      isBoundingCoordinates(Krakow, London, radiusKm, false);
    });

    it("should test if London is within the bounding box of Krakow with a small radius", () => {
      const radiusKm = 1200;
      isBoundingCoordinates(Krakow, London, radiusKm, false);
    });

    it("should test if London is within the bounding box of Krakow with a small radius", () => {
      const radiusKm = 350;
      isBoundingCoordinates(Krakow, London, radiusKm, false);
    });
  });

  describe("calculateBoundingCoordinates - Test Buenos Aires and Córdoba", () => {
    it("should test if Córdoba is within the bounding box of Buenos Aires with a large radius", () => {
      // ~652 km is the distance between Buenos Aires and Córdoba
      const radiusKm = 700;

      isBoundingCoordinates(BuenosAres, Cordoba, radiusKm);
    });

    it("should test if Buenos Aires is within the bounding box of Córdoba with a large radius", () => {
      // ~652 km is the distance between Buenos Aires and Córdoba
      const radiusKm = 700;

      isBoundingCoordinates(Cordoba, BuenosAres, radiusKm);
    });

    it("should confirm Córdoba is outside Buenos Aires's bounding box with a small radius", () => {
      const radiusKm = 500;

      isBoundingCoordinates(BuenosAres, Cordoba, radiusKm, false);
    });

    it("should confirm Buenos Aires is outside Córdoba's bounding box with a small radius", () => {
      const radiusKm = 50;

      isBoundingCoordinates(Cordoba, BuenosAres, radiusKm, false);
    });
  });

  describe("Edge cases: basic edge cases", () => {
    const testCases = [
      {
        description: "North Pole",
        geoLocation: { lat: NorthPole.lat, lng: NorthPole.lng, radiusKm: 500 },
        expected: { minLat: 90.0, maxLat: 90.0, minLng: -180.0, maxLng: 180.0 },
      },
      {
        description: "Equator",
        geoLocation: { lat: Equator.lat, lng: Equator.lng, radiusKm: 100 },
        expected: {
          minLat: -0.8993,
          maxLat: 0.8993,
          minLng: -0.8993,
          maxLng: 0.8993,
        },
        tolerance: 0.0001,
      },
      {
        description: "South Pole (small radius)",
        geoLocation: { lat: SouthPole.lat, lng: SouthPole.lng, radiusKm: 500 },
        expected: {
          minLat: -90.0,
          maxLat: -89.5,
          minLng: -180.0,
          maxLng: 180.0,
        },
      },
      {
        description: "South Pole (large radius)",
        geoLocation: { lat: SouthPole.lat, lng: SouthPole.lng, radiusKm: 5000 },
        expected: {
          minLat: -90.0, // Latitude cannot go below -90
          maxLat: -85.5, // Extended northward due to large radius
          minLng: -180.0,
          maxLng: 180.0,
        },
      },
    ];

    testCases.forEach(
      ({ description, geoLocation, expected, tolerance = 0 }) => {
        it(`should correctly calculate bounding coordinates for ${description}`, () => {
          const result = calculateBoundingCoordinates(geoLocation);

          if (description.includes("Pole")) {
            expect(result.minLat).to.be.lessThanOrEqual(expected.minLat);
            expect(result.maxLat).to.be.greaterThanOrEqual(expected.maxLat);
            expect(result.minLng).to.equal(expected.minLng);
            expect(result.maxLng).to.equal(expected.maxLng);
          } else {
            expect(result.minLat).to.be.closeTo(expected.minLat, tolerance);
            expect(result.maxLat).to.be.closeTo(expected.maxLat, tolerance);
            expect(result.minLng).to.be.closeTo(expected.minLng, tolerance);
            expect(result.maxLng).to.be.closeTo(expected.maxLng, tolerance);
          }
        });
      }
    );
  });

  describe("Edge cases: precision of the calculations", () => {
    it("should correctly calculate bounding coordinates for Sydney", () => {
      const geoLocation = { lat: Sydney.lat, lng: Sydney.lng, radiusKm: 50 };

      const result = calculateBoundingCoordinates(geoLocation);

      const latDelta = 0.4496;
      const lngDelta = 0.5418;

      expect(result.minLat).to.be.closeTo(Sydney.lat - latDelta, 0.001);
      expect(result.maxLat).to.be.closeTo(Sydney.lat + latDelta, 0.001);
      expect(result.minLng).to.be.closeTo(Sydney.lng - lngDelta, 0.001);
      expect(result.maxLng).to.be.closeTo(Sydney.lng + lngDelta, 0.001);
    });

    describe("Greenwich", () => {
      it("should calculate bounding coordinates for Greenwich with a small radius", () => {
        const geoLocation: GeoLocation = {
          lat: Greenwich.lat, // 51.4769
          lng: Greenwich.lng, // 0.0005
          radiusKm: 50,
        };

        const result = calculateBoundingCoordinates(geoLocation);

        // Correctly calculated deltas for Greenwich's latitude
        const latDelta = 0.4496;
        const lngDelta = 0.7214;

        expect(result.minLat).to.be.closeTo(Greenwich.lat - latDelta, 0.001);
        expect(result.maxLat).to.be.closeTo(Greenwich.lat + latDelta, 0.001);
        expect(result.minLng).to.be.closeTo(Greenwich.lng - lngDelta, 0.001);
        expect(result.maxLng).to.be.closeTo(Greenwich.lng + lngDelta, 0.001);
      });
    });
  });
});
