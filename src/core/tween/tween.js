import TIMELINE_REVERSE_KEY from '../timeline/key.js';

import selector from '../../helpers/selector.js';
import TweenBase from './tweenbase.js';

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
const space = (time, length, idx) => {
  return Math.abs(time) * (Math.sign(time) < 0 ? length - idx : idx);
};

//
/**
 * Tweening Starting Function
 * @param {any} elements
 * @param {tweenOptionsType} options
 * @returns {tweenReturnsType}
 */
export function tween(elements, options = {}) {
  const tweens = [];
  const nodes = selector(elements) || [];
  const length = nodes.length - 1;

  let _dur = 0;
  let _delay = 0;

  options = {
    space: 0,
    delay: 0,
    duration: 1,
    ease: 'linear',
    ...options,
  };

  const actions = {
    onStart: options.onStart,
    onUpdate: options.onUpdate,
    onComplete: options.onComplete,
  };

  /**
   * Create a new tween instance for each element.
   * When reusing the same element, the same instance is reused.
   */
  const tweenNodes = [];
  for (let i = 0; i <= length; i++) {
    const node = nodes[i];
    let delay = options.delay;
    delay += space(options.space, length, i);

    if (i !== 0) {
      options.onStart = undefined;
      options.onUpdate = undefined;
    }

    if (i !== length) {
      options.onComplete = undefined;
    } else {
      options.onComplete = actions.onComplete;
      _dur = options.duration;
      _delay = delay;
    }

    const newOption = { ...options, delay };
    let tweenbase;
    if ((tweenbase = TWEENS_STORAGE.get(node))) {
      tweenbase.push('play', newOption);
      tweens.push(tweenbase);
    } else {
      const tweenbase = new TweenBase(node, newOption);
      TWEENS_STORAGE.set(node, tweenbase);
      tweens.push(tweenbase);
    }

    tweenNodes.push(newOption);
  }

  return {
    reverse: (key, time) => {
      tweens.forEach((tween, idx) => {
        const isTimeline = key === TIMELINE_REVERSE_KEY;
        const delay =
          (isTimeline ? time : 0) + space(options.space, length, length - idx);
        tween.push('reverse', { delay });
      });
    },
    play: () => {
      tweens.forEach((tween) => {
        tween.push('play', { delay: 0 });
      });
    },
    pause: () => {
      tweens.forEach((tween) => {
        tween._stop();
      });
    },
    kill: () => {
      tweens.forEach((tween) => {
        tween.delay._destroy();
      });
    },
    _dur,
    _delay,
    elements: nodes,
  };
}
