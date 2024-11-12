import { lerp } from '../math/math';
import { NUMERIC } from '../helpers/regex';

const G_NUMBER = new RegExp(`${NUMERIC}`, 'g');

const _circle = (s, e) => {
  const start = s.match(G_NUMBER);
  const end = e.match(G_NUMBER);

  const startValue = {
    radius: +start[0],
    x: +start[1] || 50,
    y: +start[2] || 50,
  };
  const endValue = { radius: +end[0], x: +end[1], y: +end[2] };

  return (t) =>
    `${lerp(startValue.radius, endValue.radius, t)}% at ${lerp(
      startValue.x,
      endValue.x,
      t
    )}% ${lerp(startValue.y, endValue.y, t)}%`;
};
const points = (arr) => {
  return arr.split(',').map((str) => {
    const arr = str.match(G_NUMBER);
    return [+arr[0], +arr[1]];
  });
};
const _polygon = (start, end) => {
  const startPoints = points(start);
  const endPoints = points(end);

  return (t) => {
    return startPoints
      .map(([x, y], idx) => {
        const [nX, nY] = endPoints[idx];
        const sperator = idx === startPoints.length - 1 ? '' : ', ';
        return `${lerp(x, nX, t)}% ${lerp(y, nY, t)}%` + sperator;
      })
      .join('');
  };
};

/**
 * @param {object} target - clip path properties.
 * @param {object} info - {computed style, parent, element}.
 * @return {Function}
 */
function clipPath(target, { computed }) {
  const isCircle = target.circle;
  const isPolygon = target.polygon;

  let start = computed.clipPath;

  if (isCircle) {
    const from = Array.isArray(isCircle);
    if (start === 'none') start = '100 at 50 50';
    const circle = _circle(
      from ? isCircle[0] : start,
      from ? isCircle[1] : isCircle
    );
    return (t) => `circle(${circle(t)})`;
  }
  if (isPolygon) {
    const from = Array.isArray(isPolygon);
    if (start === 'none') start = 'polygon(0 0, 100 0, 100 100, 0 100)';

    const polygon = _polygon(
      from ? isPolygon[0] : start,
      from ? isPolygon[1] : isPolygon
    );
    return (t) => `polygon(${polygon(t)})`;
  }
}

export default clipPath;
