const CIRCLE_REGEX = /(\d+)%?( at (\d+)%? (\d+)%?)?/;
const POLYGON_COORDS_REGEX = /\((.*)\)/;

const _circle = (s, e) => {
  const start = CIRCLE_REGEX.exec(s);
  const end = CIRCLE_REGEX.exec(e);

  const startValue = {
    radius: +start[1],
    x: start[3] ? +start[3] : 50,
    y: +start[4] ? +start[4] : 50,
  };
  const endValue = { radius: +end[1], x: +end[3], y: +end[4] };

  const radiusLerp = endValue.radius - startValue.radius;
  const xLerp = endValue.x - startValue.x;
  const yLerp = endValue.y - startValue.y;

  return (t) =>
    `${startValue.radius + radiusLerp * t}% at ${startValue.x + xLerp * t}% ${
      startValue.y + yLerp * t
    }%`;
};

const points = (arr) => {
  return arr.split(',').map((str) => {
    const arr = str.match(/\d+/g);
    return [+arr[0], +arr[1]];
  });
};
const _polygon = (s, e) => {
  s = POLYGON_COORDS_REGEX.exec(s) || s;
  e = POLYGON_COORDS_REGEX.exec(e) || e;

  const start = points(Array.isArray(s) ? s[1] : s);
  const end = points(Array.isArray(e) ? e[1] : e);

  const lerp = end.map(([x, y], i) => [x - start[i][0], y - start[i][1]]);
  return (t) =>
    lerp.reduce((a, b, i) => {
      const x = start[i][0] + b[0] * t;
      const y = start[i][1] + b[1] * t;
      const sperator = i === lerp.length - 1 ? '' : ', ';
      return a + `${x}% ${y}%` + sperator;
    }, '');
};

/**
 * @param {object} p - clip path properties.
 * @param {object} info - {computed style, parent, element}.
 * @return {Function}
 */
function clipPath(p, { computed }) {
  const isCircle = p.circle;
  const isPolygon = p.polygon;

  let start = computed.clipPath;

  if (isCircle) {
    const from = Array.isArray(isCircle);
    if (!from) {
      if (start === 'none') {
        start = '100 at 50 50';
      } else {
        start = /\((.*)\)/.exec(start)[1];
      }
    }
    const circle = _circle(
      from ? isCircle[0] : start,
      from ? isCircle[1] : isCircle
    );
    return (t) => `circle(${circle(t)})`;
  }
  if (isPolygon) {
    const from = Array.isArray(isPolygon);

    if (!from) {
      if (start === 'none') {
        start = 'polygon(0 0, 100 0, 100 100, 0 100)';
      }
    }

    const polygon = _polygon(
      from ? isPolygon[0] : start,
      from ? isPolygon[1] : isPolygon
    );
    return (t) => `polygon(${polygon(t)})`;
  }
}

export default clipPath;
