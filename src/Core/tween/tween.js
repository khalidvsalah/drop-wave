import TweenBase from './tweenbase';
import { storage, store } from '../../Utils/states/storage';
import { REVERSE } from '../timeline/timeline';

/**
 * Tweening Starting Function
 *
 * @param {Array|Node|NodeList} elements
 * @param {import('../../types/tweenTypes.js').TWEEN_OPTIONS} options
 * @returns {import('../../types/tweenTypes.js').TWEEN_CONTROLLERS}
 */
export function tween(elements, options = {}) {
  try {
    const tweens = [];
    const nodes = [];

    options = {
      space: 0,
      delay: 0,
      duration: 1,
      ease: 'linear',
      ...options,
    };

    if (typeof elements === 'string') {
      nodes.push(...document.querySelectorAll(elements));
    } else if (elements instanceof NodeList) {
      nodes.push(...elements);
    } else if (Array.isArray(elements)) {
      if (typeof elements[0] === 'number') {
        nodes.push(elements);
      } else {
        nodes.push(...elements);
      }
    } else {
      nodes.push(elements);
    }

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
      delay += options.space * i;

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
      if (storage.has(element)) {
        const tweenbase = store(element);
        tweenbase.push('play', newOptions);
        tweens.push(tweenbase);
      } else {
        const tween = new TweenBase(element, newOptions);
        tweens.push(store(element, tween));
      }

      return newOptions;
    });

    return {
      reverse: (symbol, time) => {
        tweens.forEach((tween, idx) => {
          const isTimeline = symbol === REVERSE;
          const delay =
            (isTimeline ? time : 0) + options.space * (length - idx);
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
  } catch (e) {
    throw TypeError('Element(s) not found: ' + elements);
  }
}
