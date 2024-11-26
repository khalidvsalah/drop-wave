import { lerp } from '../../math/math';
import { NUMERIC } from '../../helpers/regex';
import { interpolatePoints } from './pointsBase';

const PAIR = new RegExp(NUMERIC + ',' + NUMERIC, 'g');
const getPairs = (str) => str.match(PAIR).map((pair) => pair.split(','));

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
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

export default {
  name: 'points',
  callback: points,
};
