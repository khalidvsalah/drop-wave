import { processing } from '../../processing/processing';
import { computed } from '../../methods/computed';

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
  if (to) {
    if (!from) from = from || computed(element);
  } else if (from) {
    if (!to) to = to || computed(element);
  }

  return processing(element, from, to);
};
