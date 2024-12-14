import { toPixels } from '../helpers/handleUnits';
import selector from '../helpers/selector';

import { observer } from '../utils/Observer';

import { offset } from '../methods/coordinate';

import { clamp, normalize, inRange } from '../math/math';
import { easingFn } from '../math/easing/index';

import { tween } from '../core/tween/tween';
import { prepareTween } from '../core/tween/helpers';

import { CSSTransform } from './utils/helpers';

export default class Trigger {
  #trigger;

  #properties = [];

  #pinObj;
  #animateObj;
  #tweenObj;

  #dir;
  #ease;
  #isY;
  #size;
  #dirEnd;

  #pinOut;
  #pinStart;
  #pinEnd;

  #iresize;
  #iupdate;

  #onUpdate;

  /**
   * @param {HTMLElement} target
   * @param {triggerOptionsType} options
   */
  constructor(target, options) {
    this.target = selector(target)[0]; // do: edit it for multiple elements
    this.options = options;

    this.#trigger = options.trigger ? selector(options.trigger) : [this.target];

    this.#pinObj = options.pin;
    this.#animateObj = options.animate;
    this.#tweenObj = options.tween;

    this.#dir = options.dir;
    this.#isY = options.dir === 'y';
    this.#size = this.#isY ? 'h' : 'w';
    this.#dirEnd = this.#dir === 'y' ? 'yE' : 'xE';

    this.#onUpdate = options.onUpdate;

    this.#init();
  }

  #init() {
    if (this.#animateObj) {
      this.#ease = easingFn[this.#animateObj.ease || 'linear'];
      this.#trigger.forEach((element) => {
        this.#properties.push(prepareTween(element, this.#animateObj));
      });
    }

    this.#iresize = observer.subscribe('resize', this.#_resize.bind(this));
    this.#_resize();
    this.#iupdate = observer.subscribe(
      this.options.channel,
      this.#_update.bind(this)
    );
  }

  #_animate(elapsed) {
    this.#properties.map((propertie) => {
      propertie.forEach(({ tween }) => tween(this.#ease(elapsed)));
    });
  }

  #_tween() {
    tween(this.#trigger, this.#tweenObj);
    this._destroy();
  }

  #_pin() {
    if (inRange(this.#pinStart, this.#pinEnd, this.scroll)) {
      this.#pinOut = false;
      const dist = Math.max(0, this.scroll - this.#pinStart);
      CSSTransform(this.#trigger, dist, this.#isY);
    } else {
      if (!this.#pinOut) {
        if (this.scroll > this.#pinEnd) {
          const dist = this.#pinEnd - this.#pinStart;
          CSSTransform(this.#trigger, dist, this.#isY);
        } else {
          CSSTransform(this.#trigger, 0, this.#isY);
        }
        this.#pinOut = true;
      }
    }
  }

  #_update({ lerp }) {
    this.scroll = lerp;
    const elapsed = clamp(0, 1, normalize(this.start, this.end, this.scroll));

    if (this.#pinObj) this.#_pin();
    if (this.#animateObj) this.#_animate(elapsed);
    if (this.#tweenObj) if (this.start <= this.scroll) this.#_tween();
    if (this.#onUpdate) this.#onUpdate(elapsed, this.target);
  }

  #_resize() {
    this.#pinOut = false;
    const coords = offset(this.target);

    if (this.#animateObj || this.#tweenObj || this.#onUpdate) {
      const start =
        typeof this.options.start === 'function'
          ? this.options.start(coords)
          : coords[this.#dir] +
            toPixels(this.options.start || '0', coords[this.#size]).pixels;
      const end =
        typeof this.options.end === 'function'
          ? this.options.end(coords)
          : coords[this.#dirEnd] +
            toPixels(this.options.end || '0', coords[this.#size]).pixels;

      this.start = start;
      this.end = end;
    }

    if (this.#pinObj) {
      const start =
        typeof this.#pinObj.start === 'function'
          ? this.#pinObj.start(coords)
          : coords[this.#dir] +
            toPixels(this.#pinObj.start || '0', coords[this.#size]).pixels;
      const end =
        typeof this.#pinObj.end === 'function'
          ? this.#pinObj.end(coords)
          : coords[this.#dirEnd] +
            toPixels(this.#pinObj.end || '0', coords[this.#size]).pixels;

      this.#pinStart = start;
      this.#pinEnd = end;
    }
  }

  _destroy() {
    this.#iresize.unsubscribe();
    this.#iupdate.unsubscribe();
  }
}
