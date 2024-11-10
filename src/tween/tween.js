import selector from '../helpers/selector.js';

import TweenBase from './tweenbase';
import { TIMELINE_REVERSE } from './Timeline.js';

export const tweensStorage = new WeakMap();

/**
 * Tweening Starting Function
 *
 * @param {Node|NodeList|string|Array} elements
 * @param {TWEEN_OPTIONS} options
 * @returns {TWEEN_CONTROLLERS}
 */
export function tween(elements, options = {}) {
  const tweens = [];
  const nodes = selector(elements);

  options = {
    space: 0,
    delay: 0,
    duration: 1,
    ease: 'linear',
    ...options,
  };

  const length = nodes.length - 1;
  const actions = {
    onStart: options.onStart,
    onUpdate: options.onUpdate,
    onComplete: options.onComplete,
  };

  /**
   * Create a new tween instance for each element.
   * When reusing the same element, the same instance is reused.
   */
  const tweenNodes = nodes.map((element, i) => {
    let delay = options.delay;
    delay +=
      Math.abs(options.space) *
      (Math.sign(options.space) < 0 ? nodes.length - 1 - i : i);

    if (i !== 0) {
      options.onStart = undefined;
      options.onUpdate = undefined;
    }

    if (i !== length) {
      options.onComplete = undefined;
    } else {
      options.onComplete = actions.onComplete;
    }

    const newOptions = { ...options, delay };
    if (tweensStorage.has(element)) {
      const tweenbase = tweensStorage.get(element);
      tweenbase.push('play', newOptions);
      tweens.push(tweenbase);
    } else {
      const tween = new TweenBase(element, newOptions);
      tweens.push(tweensStorage.set(element, tween));
    }

    return newOptions;
  });

  return {
    reverse: (symbol, time) => {
      tweens.forEach((tween, idx) => {
        const isTimeline = symbol === TIMELINE_REVERSE;
        const delay = (isTimeline ? time : 0) + options.space * (length - idx);
        tween.push('reverse', { delay });
      });
    },
    play: () => {
      tweens.forEach((tween, idx) => {
        tween.push('play', tweenNodes[idx]);
      });
    },
    pause: () => {
      tweens.forEach((tween) => {
        tween.stop();
      });
    },
    kill: () => {
      tweens.forEach((tween) => {
        tween.delay.destroy();
      });
    },
  };
}
