import selector from '../../helpers/selector';
import { NUMERIC } from '../../helpers/regex';

import { lerp } from '../../math/math';
import { interpolatePoints } from './pointsBase';

const PAIR = new RegExp(NUMERIC + '[,|\\s]' + NUMERIC, 'g');
const getPairs = (str) => str.match(PAIR).map((pair) => pair.split(/[,|\s]/));

/**
 * @param {string} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const points = (endValue, { element }) => {
  const node = selector(endValue)[0];
  let startValue = getPairs(element.getAttribute('points'));

  endValue = node ? node.getAttribute('points') : endValue;
  endValue = getPairs(endValue);

  const newPoints = interpolatePoints(endValue, startValue);

  if (startValue.length > endValue.length) endValue = newPoints;
  else startValue = newPoints;

  return (t) => {
    return startValue
      .map((point, idx) => {
        const [x, y] = point;
        const [nX, nY] = endValue[idx];
        return `${lerp(x, nX, t)},${lerp(y, nY, t)} `;
      })
      .join('');
  };
};

export default {
  name: 'points',
  callback: points,
};
