/**
 * Utility that can be used to log out map events
 * Useful for debugging and getting visibility into different
 * parts of the map lifecycle
 */
class MapLogger {
  constructor({ enabled = false, prefix }) {
    this.prefix = prefix;
    this.enabled = enabled;
  }

  log(event) {
    if (this.enabled) {
      console.log(`${this.prefix} - ${event}`);
    }
  }
}

export const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matches) {
    return null;
  }

  function coordinateFeature(lng, lat) {
    return {
      center: [lng, lat],
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      place_name: "Lat: " + lat + " Lng: " + lng,
      place_type: ["coordinate"],
      properties: {},
      type: "Feature",
    };
  }

  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];

  if (coord1 >= -90 && coord1 <= 90 && coord2 >= -180 && coord2 <= 180) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
  }

  if (coord2 >= -90 && coord2 <= 90 && coord1 >= -180 && coord1 <= 180) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
  }

  return geocodes;
};

export { MapLogger };
