const axios = require('axios');

/**
   * Gives a random point in an a given location and
   * a radius and said point is on a road using Google Roads API
   *
   * @param {Number} lat Latitudinal coordinate
   * @param {Number} long Longitudinal coordinate
   * @param {Number} radius Radial distance(km) from central coordinate
   */

const findRandomPoint = (lat, long, radius) => {
  const angle = (Math.random() * 2 * Math.PI);
  const distance = Math.sqrt(Math.random() * radius * radius);
  const angularDistance = distance / 6371;
  const latRad = Number(lat) * Math.PI / 180;
  const longRad = Number(long) * Math.PI / 180;
  const latHolder = Math.asin(Math.sin(latRad) * Math.cos(angularDistance)
    + Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(angle));
  const longHolder = longRad
    + Math.atan2(Math.sin(angle) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - (Math.sin(latRad) * Math.sin(latHolder)));
  const longHolderNormalized = ((longHolder + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  const newLat = latHolder * 180 / Math.PI;
  const newLong = longHolderNormalized * 180 / Math.PI;
  return axios.get('https://roads.googleapis.com/v1/nearestRoads', {
    params: {
      points: `${newLat},${newLong}`,
      key: process.env.ROADS_API,
    },
  })
    .then((result) => {
      if (!result.data.snappedPoints) {
        return null;
      }
      const { location } = result.data.snappedPoints[0];
      const coords = Object.values(location);
      return coords;
    })
    .catch((err) => {
      console.error(`Failed to snap to road: ${err}`);
    });
};

/**
 * Checks if a location is within a certain radius of coordinates
 * Returns true if true.
 *
 * @param {Array} coords1 Array of latitude, longitude coordinates
 * @param {Array} coords2 Array of latitude, longitude coordinates
 * @param {Number} radius Estimated radial distance between points
 * @returns {Boolean} True if the distance is less than or equal to the radius
 */

const checkDistance = (coords1, coords2, radius) => {
  const toRadians = x => x * Math.PI / 180;

  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371;

  const x1 = lat2 - lat1;
  const x2 = lon2 - lon1;
  const dLat = toRadians(x1);
  const dLon = toRadians(x2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance <= radius;
};

const generateMarkers = async (lat, long, radius, count) => {
  try {
    const points = [];
    while (points.length < count) {
      let coords = await findRandomPoint(lat, long, radius);
      if (coords !== null) {
        let inRange = checkDistance([lat, long], coords, radius);
        while (!inRange) {
          coords = await findRandomPoint(lat, long, radius);
          inRange = checkDistance([Number(lat), Number(long)], coords, radius);
        }
        points.push(coords);
      }
    }
    return points;
  } catch (err) {
    console.error(`Failed to generate markers: ${err}`);
  }
};

module.exports = {
  generateMarkers,
};
