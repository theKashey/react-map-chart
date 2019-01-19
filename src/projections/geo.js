const TILE_SIZE = 256;
const pixelOrigin = [TILE_SIZE / 2, TILE_SIZE / 2];
const pixelsPerLonDegree = TILE_SIZE / 360;

export const geo = {
  projection: latLng => [
    pixelOrigin[0] + (latLng[0] * pixelsPerLonDegree),
    pixelOrigin[1] - (latLng[1] * pixelsPerLonDegree),
  ],
  viewBox: '0 40 266 150',
};
