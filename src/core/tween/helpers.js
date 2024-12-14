import { processing } from '../../processing/processing';
import { computed } from '../../methods/computed';
import matcher from '../../processing/helpers/matcher';

/**
 * Tweens storage
 */
export const TWEENS_STORAGE = new WeakMap();

/**
 * Handing time between tweens
 * @param {number} time
 * @param {number} length
 * @param {number} idx
 * @returns {number}
 */
export const handleTweenSpace = (time, length, idx) => {
  return Math.abs(time) * (Math.sign(time) < 0 ? length - idx : idx);
};

/**
 *
 * @param {HTMLElement} element
 * @param {propertiesType} obj
 * @returns {propertiesType}
 */
const getComputedValues = (element, obj) => {
  let computedValues;
  const values = {};

  Object.keys(obj).map((key) => {
    if (matcher(key).type === 'CSS') {
      if (!computedValues) computedValues = computed(element);
      values[key] = computedValues[key];
    } else {
      values[key] = element.getAttribute(key);
    }
  });

  return values;
};

/**
 * Prepare Tween for animatnig
 *
 * @param {HTMLElement} element
 * @returns {Array}
 */
export const prepareTween = (element, nextTween) => {
  const tweennInstance = TWEENS_STORAGE.get(element);

  if (tweennInstance) {
    if (tweennInstance.isRunning) tweennInstance._done();
    tweennInstance.dir = 0;
  }

  let { to, from } = nextTween;

  from = from || getComputedValues(element, to);
  to = to || getComputedValues(element, from);

  return processing(element, from, to);
};
