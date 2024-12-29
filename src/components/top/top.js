import { lerp } from '../../math/math';
import { getUnit, getValue, unitConventer } from '../../helpers/handleUnits';

/**
 * @param {object} endValue
 * @param {DOMElementContext}
 * @return {Function}
 */
const top = (endValue, { computed, parent }) => {
  const unit = getUnit(endValue) || 'px';
  let startValue = computed.top;
  startValue = unitConventer(startValue, parent.offsetHeight, unit).value;
  endValue = getValue(endValue);
  return (t) => `${lerp(startValue, endValue, t)}${unit}`;
};

export default {
  name: 'top',
  callback: top,
};
