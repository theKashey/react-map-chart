const TILE_SIZE = 256;
const pixelOrigin = [TILE_SIZE / 2, TILE_SIZE / 2];
const pixelsPerLonDegree = TILE_SIZE / 360;

const degreesToRadians = deg => deg * .017453292519943295;

const Y = (1 + (Math.sqrt(2) * 0.5));

export const gall = {
  projection: latLng => [
    pixelOrigin[0] + (latLng[0] * pixelsPerLonDegree),
    pixelOrigin[1] - (80 * pixelsPerLonDegree * Y * Math.tan(degreesToRadians(latLng[1]) / 2)),
  ],
  viewBox: '0 40 266 150',
};
