import { lerp } from '../../math/math';

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
 */
const opacity = (target, { computed }) => {
  const from = Array.isArray(target);
  const o = {
    start: from ? target[0] : +computed.opacity,
    end: from ? target[1] : target,
  };
  o.lerp = o.end - o.start;
  return (t) => `${lerp(o.start, o.end, t)}`;
};

export default {
  name: 'opacity',
  callback: opacity,
};
