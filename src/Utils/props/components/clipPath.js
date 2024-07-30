/**
 * @param {object} p
 * @return {Function}
 */
const _circle = p => {
  const start = /(\d+) at (\d+) (\d+)/.exec(p[0]);
  const end = /(\d+) at (\d+) (\d+)/.exec(p[1]);

  const startValue = { radius: +start[1], x: +start[2], y: +start[3] };
  const endValue = { radius: +end[1], x: +end[2], y: +end[3] };

  const radiusLerp = endValue.radius - startValue.radius;
  const xLerp = endValue.x - startValue.x;
  const yLerp = endValue.y - startValue.y;

  return t =>
    `${startValue.radius + radiusLerp * t} at ${startValue.x + xLerp * t} ${
      startValue.y + yLerp * t
    }`;
};

const points = p =>
  p.split(',').map(a => {
    const coord = /(\d+)%? (\d+)%?/.exec(a);
    return [+coord[1], +coord[2]];
  });

/**
 * @param {object} p
 * @return {Function}
 */
const _polygon = p => {
  const start = points(p[0]);
  const end = points(p[1]);
  const lerp = start.map(([x, y], i) => [end[i][0] - x, end[i][1] - y]);

  return t =>
    lerp.reduce((a, b, i) => {
      const x = start[i][0] + b[0] * t;
      const y = start[i][1] + b[1] * t;
      const sperator = i === lerp.length - 1 ? '' : ', ';
      return a + `${x}% ${y}%` + sperator;
    }, '');
};

/**
 * @param {object} p - clip path properties.
 * @return {Function}
 */
function clipPath(p) {
  if (p.circle) {
    const circle = _circle(p.circle);
    return t => `circle(${circle(t)})`;
  }
  if (p.polygon) {
    const polygon = _polygon(p.polygon);
    return t => `polygon(${polygon(t)})`;
  }
}

export default {
  callback: clipPath,
  setValue: element => value => (element.style.clipPath = value)
};
