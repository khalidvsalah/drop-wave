import { lerp } from '../../math/math';
import { getUnit, getValue, unitConventer } from '../../helpers/handleUnits';

/**
 * @param {object} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const width = (endValue, { computed }) => {
  const unit = getUnit(endValue) || 'px';
  let startValue = computed.width;
  startValue = unitConventer(startValue, 0, unit).value;
  endValue = getValue(endValue);
  return (t) => `${lerp(startValue, endValue, t)}${unit}`;
};

export default {
  name: 'width',
  callback: width,
};
