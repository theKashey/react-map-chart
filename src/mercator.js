const TILE_SIZE = 256;
const pixelOrigin = [TILE_SIZE / 2, TILE_SIZE / 2];
const pixelsPerLonDegree = TILE_SIZE / 360;
const pixelsPerLonRadian = TILE_SIZE / (2 * Math.PI);

function bound(value, optMin, optMax) {
  value = Math.max(value, optMin);
  value = Math.min(value, optMax);
  return value;
}

const degreesToRadians = deg => deg * (Math.PI / 180);


export function mercator(latLng) {
  const siny = bound(Math.sin(degreesToRadians(latLng[1])), -0.9999, 0.9999);
  return [
    pixelOrigin[0] + (latLng[0] * pixelsPerLonDegree),
    // pixelOrigin[1] - (latLng[1] * pixelsPerLonDegree),
    pixelOrigin[1] + (0.5 * Math.log((1 + siny) / (1 - siny)) * -pixelsPerLonRadian),
  ];
}
