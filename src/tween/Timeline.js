import { tween } from './tween';

export const TIMELINE_REVERSE = Symbol('');
export class Timeline {
  #tweens = [];
  #time = 0;

  /**
   * @param {{delay:number}} options
   */
  constructor({ delay = 0 } = {}) {
    this.#time = delay;
  }

  /**
   * @param {Array|Node|NodeList} elements
   * @param {import('../../types/tweenTypes').TWEEN_OPTIONS} options
   * @param {string} delay
   */
  to(elements, options, delay) {
    this.#time += +delay || 0;
    options.delay = (options.delay || 0) + this.#time;
    this.#tweens.push({
      delay: options.delay,
      tween: tween(elements, options),
    });
    this.#time += options.delay + options.duration;
    return this;
  }

  reverse() {
    this.#tweens.map(({ tween }, i) => {
      const length = this.#tweens.length - i - 1;
      tween.reverse(REVERSE, this.#tweens[length].delay);
    });
  }
}
