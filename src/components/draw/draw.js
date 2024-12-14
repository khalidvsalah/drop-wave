import { lerp } from '../../math/math';

/**
 * @param {number} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const draw = (endValue, { element, computed }) => {
  const startValue = parseFloat(computed.strokeDashoffset);

  const length = element.getTotalLength();
  element.style.strokeDasharray = length;

  endValue = (1 - endValue) * length;
  return (t) => `${lerp(startValue, endValue, t)}`;
};

export default {
  name: 'strokeDashoffset',
  callback: draw,
};
