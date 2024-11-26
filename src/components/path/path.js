import { lerp } from '../../math/math';
import { parsePathData, normalizePathLengths } from './pathBase';

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
 */
const path = (target, { element }) => {
  const start = parsePathData(target);
  const end = parsePathData(element.getAttribute('d'));

  const { normalizedStart, normalizedEnd } = normalizePathLengths(start, end);

  return (t) => {
    let interpolatedPath = '';

    for (let i = 0; i < normalizedStart.length; i++) {
      const startCommand = normalizedStart[i];
      const endCommand = normalizedEnd[i];

      const interpolatedCommand = startCommand.map((value, index) => {
        return isNaN(value) ? value : lerp(value, endCommand[index], t);
      });

      interpolatedPath += interpolatedCommand.join(' ') + ' ';
    }

    return interpolatedPath.trim();
  };
};

export default {
  name: 'path',
  callback: path,
};
