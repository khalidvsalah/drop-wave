import { lerp } from '../../math/math';
import { getUnit, getValue, unitConventer } from '../../helpers/handleUnits';

/**
 * @param {object} endValue
 * @param {DOMElementContext}
 * @return {Function}
 */
const width = (endValue, { computed, parent }) => {
  const unit = getUnit(endValue) || 'px';
  let startValue = computed.width;
  startValue = unitConventer(startValue, parent.offsetWidth, unit).value;
  endValue = getValue(endValue);
  return (t) => `${lerp(startValue, endValue, t)}${unit}`;
};

export default {
  name: 'width',
  callback: width,
};
