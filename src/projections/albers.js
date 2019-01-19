const TILE_SIZE = 256;
const pixelOrigin = [TILE_SIZE / 2, TILE_SIZE / 2];
const pixelsPerLonDegree = TILE_SIZE / 360;


const d2r = angleInDegrees => angleInDegrees * .017453292519943295;

let latbox = [50, -50, 50, 50]

const lat0 = d2r(latbox[0]);
const lng0 = d2r(latbox[1]);
const phi1 = d2r(latbox[2]);
const phi2 = d2r(latbox[3]);

const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
const c = Math.cos(phi1);
const C = c * c + 2 * n * Math.sin(phi1);
const p0 = Math.sqrt(C - 2 * n * Math.sin(lat0)) / n;


export const albers = {
  projection: latLng => {
    const theta = n * (d2r(latLng[0]) - lng0);
    const p = Math.sqrt(C - 2 * n * Math.sin(d2r(latLng[1]))) / n;
    return [
      p * Math.sin(theta),
      p0 - p * Math.cos(theta),
    ]
  },
};