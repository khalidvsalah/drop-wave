import TweenBase from './tweenbase';
import { storage, store } from '../../Utils/states/storage';
import { query } from '../../Utils/methods/query';

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

export const kill = element => {
  element = typeof element === 'string' ? query.el(element) : element;
  if (storage.has(element)) {
    store(element).late.destroy();
  }
};

/**
 * @param {Array|HTMLElement|NodeList} elements
 * @param {TWEEN_OPTIONS} options
 * @returns {TWEEN_CONTROLLERS}.
 */
export function tween(elements, options = {}) {
  options.space = options.space || 0;
  let nodes;

  elements = typeof elements === 'string' ? query.els(elements) : elements;
  if (elements instanceof NodeList) nodes = elements;
  else if (Array.isArray(elements)) {
    if (typeof elements[0] !== 'number') nodes = [elements];
    else nodes = elements;
  } else nodes = [elements];

  const arr = [];
  const length = nodes.length - 1;

  nodes.forEach((element, i) => {
    if (i !== 0) {
      options.late += options.space * i;
      options.onStart = undefined;
      options.onUpdate = undefined;
      options.onComplete = undefined;
    }
    if (storage.has(element)) {
      const tweenbase = store(element);
      arr.push(tweenbase.push(options, 'p'));
    } else {
      arr.push(store(element, new TweenBase(element, options)));
    }
  });

  return {
    reverse: () => {
      arr.forEach((t, i) => {
        t.push('r', { late: options.space * (length - i) });
      });
    },
    play: () => {
      arr.forEach(t => {
        t.push('p');
      });
    },
    pause: () => {
      arr.forEach(t => {
        t.stop();
      });
    },
    kill: () => {
      arr.forEach(t => {
        t.late.destroy();
      });
    }
  };
}
