/**
 * @param {object} p
 * @return {Function}
 */

const cRegex = /(\d+)%?( at (\d+)%? (\d+)%?)?/;
const _circle = (s, e) => {
  const start = cRegex.exec(s);
  const end = cRegex.exec(e);

  const startValue = {
    radius: +start[1],
    x: start[3] ? +start[3] : 50,
    y: +start[4] ? +start[4] : 50
  };
  const endValue = { radius: +end[1], x: +end[3], y: +end[4] };

  const radiusLerp = endValue.radius - startValue.radius;
  const xLerp = endValue.x - startValue.x;
  const yLerp = endValue.y - startValue.y;

  return t =>
    `${startValue.radius + radiusLerp * t}% at ${startValue.x + xLerp * t}% ${
      startValue.y + yLerp * t
    }%`;
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
const _polygon = (s, e) => {
  const start = points(s);
  const end = points(e);
  const lerp = end.map(([x, y], i) => [end[i][0] - x, end[i][1] - y]);

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
 *  @param {object} info - computed style.
 * @return {Function}
 */
function clipPath(p, { computed }) {
  let start = computed.clipPath;
  const isCircle = p.circle;
  if (isCircle) {
    if (start === 'none') {
      start = '100 at 50 50';
    } else {
      start = /\((.*)\)/.exec(start)[1];
    }
    const cform = Array.isArray(isCircle);
    const circle = _circle(
      cform ? isCircle[0] : start,
      cform ? isCircle[1] : isCircle
    );
    return t => `circle(${circle(t)})`;
  }
  const isPolygon = p.circle;
  if (isPolygon) {
    // run some tests
    if (start === 'none') {
      start = '0 0, 100 0, 100 100, 0 100';
    }
    const pform = Array.isArray(isCircle);
    const polygon = _polygon(
      pform ? isPolygon[0] : start,
      pform ? isPolygon[1] : isPolygon
    );
    return t => `polygon(${polygon(t)})`;
  }
}

export default {
  callback: clipPath,
  setValue: element => value => (element.style.clipPath = value)
};
