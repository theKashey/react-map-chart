const d2r = angleInDegrees => angleInDegrees * .017453292519943295;

const pixelsPerLonDegree = 256;

const defaultFactor = {
  latLng: [50, -40],
  phi: [50, 50]
};

const innerGetFactors = ({latLng, phi}) => {
  const lat0 = d2r(latLng[0]);
  const lng0 = d2r(latLng[1]);
  const phi1 = d2r(phi[0]);
  const phi2 = d2r(phi[1]);

  const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
  const c = Math.cos(phi1);
  const C = c * c + 2 * n * Math.sin(phi1);
  const p0 = Math.sqrt(C - 2 * n * Math.sin(lat0)) / n;

  return {p0, n, C, lng0}
};

let lastFactors;
let lastResult;

const getFactors = (factors = defaultFactor) => {
  if (lastFactors === factors) {
    return lastResult;
  }
  lastResult = innerGetFactors(factors);
  lastFactors = factors;
  return lastResult;
}

export const albers = {
  projection: (latLng, options) => {
    const {lng0, n, C, p0} = getFactors(options);
    const theta = n * (d2r(latLng[0]) - lng0);
    const p = Math.sqrt(C - 2 * n * Math.sin(d2r(latLng[1]))) / n;
    return [
      (p0 - p * Math.cos(theta)) * pixelsPerLonDegree,
      p * Math.sin(theta) * pixelsPerLonDegree,
    ]
  },
  viewBox: '50 0 600 500',
};