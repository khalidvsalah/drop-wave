import TIMELINE_REVERSE_KEY from './key';

import { tween } from '../tween/tween';
import { kill } from '../tween/kill';

export class Timeline {
  #tweens = [];
  #timelineDelay = 0;
  #delay = 0;
  #called = 0;

  /**
   * @param {timelineOptionsType} [options]
   */
  constructor(options = { delay: 0 }) {
    this.name = options.name;
    this.#timelineDelay = options.delay;
    this.#delay = options.delay;
  }

  /**
   * @param {any} elements
   * @param {tweenOptionsType} [options]
   * @param {string} [timeOffset]
   * @returns {Timeline}
   */
  to(elements, options, timeOffset) {
    const delay = this.#delay + (+timeOffset || 0);

    const tweenbase = tween(elements, { ...options, delay });
    this.#tweens.push(tweenbase);

    this.#called++;
    this.#delay = tweenbase._dur + tweenbase._delay;

    return this;
  }

  reverse() {
    this.#tweens.map((tween, i) => {
      kill(tween.elements);
      const idx = this.#tweens.length - 1 - i;
      const { _delay } = this.#tweens[idx];
      tween.reverse(TIMELINE_REVERSE_KEY, _delay - this.#timelineDelay);
    });
  }

  play() {}
}
