import { lerp } from '../../math/math';

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
 */
const draw = (target, { element, computed }) => {
  const start = parseFloat(computed.strokeDashoffset);
  const length = element.getTotalLength();
  element.style.strokeDasharray = length;

  const ofrom = Array.isArray(target);
  const o = {
    start: ofrom ? (1 - target[0]) * length : start,
    end: (1 - (ofrom ? target[1] : target)) * length,
  };
  return (t) => `${lerp(o.start, o.end, t)}`;
};

export default {
  name: 'strokeDashoffset',
  callback: draw,
};
