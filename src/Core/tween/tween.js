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

export const kill = el => storage.has(el) && store(el).late.destroy();

/**
 * @param {string|Array|HTMLElement|NodeList} elements
 * @param {TWEEN_OPTIONS} options
 * @returns {{play:Function, reverse: Function, kill: Function}}.
 */
export function tween(elements, options = {}) {
  let nodes;

  if (elements instanceof NodeList) nodes = elements;
  else if (Array.isArray(elements)) {
    if (typeof elements[0] !== 'number') nodes = [elements];
    else nodes = elements;
  } else nodes = [elements];

  const tweens = [];
  const length = nodes.length - 1;

  nodes.forEach(element => {
    if (storage.has(element)) {
      const tweenbase = store(element);
      tweens.push(tweenbase.push(options, 'p'));
      // late: options.late + options.space * i,
      // onStart: null,
      // onUpdate: null,
      // onComplete: null
    } else {
      tweens.push(store(element, new TweenBase(element, options)));
    }
  });

  const methods = {
    // reverse: late => {
    //   options.late = late || 0;
    //   // for (let i = 0; i <= length; i++) {
    //   //   const idx = length - i;
    //   //   if (idx === 0) tweens[i].push(options, 'r');
    //   //   else
    //   //     tweens[i].push(
    //   //       {
    //   //         ...options,
    //   //         late: options.late + options.space * i,
    //   //         onStart: null,
    //   //         onUpdate: null,
    //   //         onComplete: null
    //   //       },
    //   //       'r'
    //   //     );
    //   // }
    // },

    reverse: () => tweens.map(tween => tween.push('r')),
    play: () => tweens.map(tween => tween.push('p')),
    pause: () => tweens.map(tween => tween.stop()),
    kill: () => tweens.map(tween => tween.late.destroy())
  };

  return methods;
}
