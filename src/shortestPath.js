function getShortestPath(contour) {
  const halfWorld = 180;
  const result = [contour[0]];
  let point = contour[0];

  for (let i = 1, l = contour.length; i < l; ++i) {
    let delta = point[0] - contour[i][0];
    if (Math.abs(delta) > halfWorld) {
      delta = delta < 0 ? -360 : 360;
    } else {
      delta = 0;
    }

    const nextPoint = [contour[i][0] + delta, contour[i][1]];
    result.push(nextPoint);
    point = nextPoint;
  }
  return result;
}

export const getShortestContour = contour => contour.map(path => getShortestPath(path));

export default getShortestPath;
