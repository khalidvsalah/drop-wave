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
    if (!from) {
      const computedStyle = computed(element);
      from = {};
      Object.keys(to).map((key) => (from[key] = computedStyle[key]));
    }
  } else if (from) {
    if (!to) {
      const computedStyle = computed(element);
      to = {};
      Object.keys(from).map((key) => (to[key] = computedStyle[key]));
    }
  }

  return processing(element, from, to);
};
