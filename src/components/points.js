import { lerp } from '../math/math';
import { NUMERIC } from '../helpers/regex';

const PAIR = new RegExp(NUMERIC + ',' + NUMERIC, 'g');
const getPairs = (str) => str.match(PAIR).map((pair) => pair.split(','));

function interpolatePoints(start, end) {
  const results = [];

  const sLength = start.length;
  const eLength = end.length;

  if (sLength < eLength) end = start;

  let length = Math.max(sLength, eLength);
  const segments = Math.min(sLength, eLength);

  for (let i = 0; i < segments; i++) {
    const vertices = Math.ceil(length / (segments - i));
    const [startX, startY] = end[i];
    const [endX, endY] = end[i + 1] || end[0];

    for (let k = 0; k < vertices; k++) {
      const map = k / (vertices - 1) || 0;
      const x = lerp(+startX, +endX, map);
      const y = lerp(+startY, +endY, map);
      results.push([x, y]);
    }

    length -= vertices;
  }

  return results;
}

/**
 * Creates an interpolating function between two sets of point coordinates.
 * @param {string} target
 * @param {object} info
 * @returns {Function}
 */
const points = (target, { element }) => {
  let start = getPairs(element.getAttribute('points'));
  let end = getPairs(target);

  const newPoints = interpolatePoints(start, end);

  if (start.length > end.length) end = newPoints;
  else start = newPoints;

  return (t) => {
    return start
      .map((point, idx) => {
        const [x, y] = point;
        const [nX, nY] = end[idx];
        return `${lerp(x, nX, t)},${lerp(y, nY, t)} `;
      })
      .join('');
  };
};

export default points;

/**
 * get vertexs.
 * get numbers of steps
 * ceil start
 * map vertexs.
 */
