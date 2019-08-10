const generateMarkers = (lat, long, radius, count) => {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.random() * 2 * Math.PI);
    const distance = Math.sqrt(Math.random() * radius * radius);
    // const xPoint = distance * Math.cos(angle);
    // const yPoint = distance * Math.sin(angle);
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
    const coords = [newLat, newLong];
    points.push(coords);
  }
  return points;
};

module.exports = {
  generateMarkers,
}
