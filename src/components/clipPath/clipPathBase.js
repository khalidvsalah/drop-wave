import { lerp } from '../../math/math';
import { NUMERIC } from '../../helpers/regex';

const NUMBER_REGEX = new RegExp(`${NUMERIC}`, 'g');

const points = (arr) => {
  return arr.split(',').map((str) => {
    const arr = str.match(NUMBER_REGEX);
    return [+arr[0], +arr[1]];
  });
};

const _circle = (s, e) => {
  const start = s.match(NUMBER_REGEX);
  const end = e.match(NUMBER_REGEX);

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

export { _circle, _polygon };
