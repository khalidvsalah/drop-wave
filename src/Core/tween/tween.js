import TweenBase from './tweenbase';
import { storage, store } from '../../Utils/states/storage';

/**
 * Tween options
 * @typedef {{
 * dur:number|undefined,
 * late:number|undefined,
 * space:number|undefined,
 * props:object|undefined,
 * onStart:Function|undefined,
 * onUpdate:Function|undefined
 * onComplete:Function|undefined
 * }} TWEEN_OPTIONS
 */
/**
 * Tween Controllers
 * @typedef {{
 * play:Function,
 * reverse: Function,
 * pause:Function,
 * kill:Function
 * }} TWEEN_CONTROLLERS
 */

export const kill = el => storage.has(el) && store(el).late.destroy();

/**
 * @param {string|Array|HTMLElement|NodeList} elements
 * @param {TWEEN_OPTIONS} options
 * @returns {TWEEN_CONTROLLERS}.
 */
export function tween(elements, options = {}) {
  options.space = options.space || 0;
  let nodes;

  if (elements instanceof NodeList) nodes = elements;
  else if (Array.isArray(elements)) {
    if (typeof elements[0] !== 'number') nodes = [elements];
    else nodes = elements;
  } else nodes = [elements];

  const tweens = [];
  const length = nodes.length - 1;

  nodes.forEach((element, i) => {
    if (i !== 0) {
      options.late = options.late + options.space * i;
      options.onStart = undefined;
      options.onUpdate = undefined;
      options.onComplete = undefined;
    }
    if (storage.has(element)) {
      const tweenbase = store(element);
      tweens.push(tweenbase.push(options, 'p'));
    } else {
      tweens.push(store(element, new TweenBase(element, options)));
    }
  });

  const methods = {
    reverse: () => {
      tweens.forEach((tween, i) => {
        tween.push('r', { late: options.space * (length - i) });
      });
    },
    play: () => {
      tweens.forEach(tween => {
        tween.push('p');
      });
    },
    pause: () => {
      tweens.forEach(tween => {
        tween.stop();
      });
    },
    kill: () => {
      tweens.forEach(tween => {
        tween.late.destroy();
      });
    }
  };

  return methods;
}
