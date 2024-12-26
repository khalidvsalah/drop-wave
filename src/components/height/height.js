import { lerp } from '../../math/math';
import { getUnit, getValue, unitConventer } from '../../helpers/handleUnits';

/**
 * @param {object} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const height = (endValue, { computed, parent }) => {
  const unit = getUnit(endValue) || 'px';
  let startValue = computed.height;
  startValue = unitConventer(startValue, parent.offsetHeight, unit).value;
  endValue = getValue(endValue);
  return (t) => `${lerp(startValue, endValue, t)}${unit}`;
};

export default {
  name: 'height',
  callback: height,
};
