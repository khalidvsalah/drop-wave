import { tween } from '../tween/tween';

export const TWEEN_REVERSE = Symbol('reverse');
export class timeline {
  /**
   * @param {{late:number}} options
   */
  constructor(options) {
    this.arr = [];
    this.time = options.late;
  }

  /**
   * @param {string|HTMLElement|NodeList} element
   * @param {import('../tween/tween').TWEEN_OPTIONS} options
   * @param {string} late
   */
  to(element, options, late) {
    const match = /^(\+|-)(\d+)/.exec(late);
    this.time += match ? (match[1] === '+' ? +match[2] : -match[2]) : 0;
    options.late = (options.late || 0) + this.time;
    this.arr.push([options.late, tween(element, options)]);
    this.time += options.late + options.dur;
    return this;
  }

  reverse() {
    this.arr.map(([late, t], i) => {
      const rLength = this.arr.length - i - 1;
      t.reverse(TWEEN_REVERSE, this.arr[rLength][0]);
    });
  }
}
