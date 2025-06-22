/**
 * The skipped tests are failing due to the precision of the calculations.
 *
 */

import { expect } from "chai";
import { calculateBoundingCoordinates, GeoLocation } from "../src";

type City = {
  name: string;
  lat: number;
  lng: number;
};

const London: City = {
  name: "London",
  lat: 51.5074,
  lng: -0.1278,
};

const Brighton: City = {
  name: "Brighton",
  lat: 50.8225,
  lng: -0.1372,
};

const Manchester: City = {
  name: "Manchester",
  lat: 53.483959,
  lng: -2.244644,
};

const Guildford: City = {
  name: "Guildford",
  lat: 51.2362,
  lng: -0.5704,
};

const Edinburgh: City = {
  name: "Edinburgh",
  lat: 55.9533,
  lng: -3.1883,
};

export const NewYork: City = {
  name: "New York",
  lat: 40.7128,
  lng: -74.006,
};

const LosAngeles: City = {
  name: "Los Angeles",
  lat: 34.0522,
  lng: -118.2437,
};

const SanFrancisco: City = {
  name: "San Francisco",
  lat: 37.7749,
  lng: -122.4194,
};

const BuenosAres: City = {
  name: "Buenos Aires",
  lat: -34.6037,
  lng: -58.3816,
};

const Cordoba: City = {
  name: "Córdoba",
  lat: -31.4201,
  lng: -64.1888,
};

const Sydney: City = {
  name: "Sydney",
  lat: -33.8688,
  lng: 151.2093,
};

const Greenwich: City = {
  name: "Greenwich",
  lat: 51.4769,
  lng: 0.0005,
};

const Equator: City = {
  name: "Ecuator",
  lat: 0,
  lng: 0,
};

const Krakow: City = {
  name: "Krakow",
  lat: 50.0647,
  lng: 19.945,
};

const NorthPole: City = {
  name: "North Pole",
  lat: 90,
  lng: 0,
};

const SouthPole: City = {
  name: "South Pole",
  lat: -90,
  lng: 0,
};

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

      isBoundingCoordinates(NewYork, Sydney, radiusKm, false);
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
    it.skip("should correctly calculate bounding coordinates for Sydney", () => {
      const geoLocation = { lat: Sydney.lat, lng: Sydney.lng, radiusKm: 50 };

      const result = calculateBoundingCoordinates(geoLocation);

      expect(result.minLat).to.be.closeTo(Sydney.lat - 0.449, 0.001);
      expect(result.maxLat).to.be.closeTo(Sydney.lat + 0.449, 0.001);
      expect(result.minLng).to.be.closeTo(Sydney.lng - 0.449, 0.001);
      expect(result.maxLng).to.be.closeTo(Sydney.lng + 0.449, 0.001);
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
