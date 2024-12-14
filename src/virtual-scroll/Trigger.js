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
  #target;

  #properties = [];

  #pinObj;
  #animateObj;
  #tweenObj;

  #dir;
  #ease;
  #isY;
  #size;
  #dirEnd;

  #isOut = true;

  #pinOut;
  #pinStart;
  #pinEnd;

  #iresize;
  #iupdate;

  #onEnter;
  #onLeave;
  #onEnterBack;
  #onLeaveBack;

  #onUpdate;

  /**
   * @param {HTMLElement} trigger
   * @param {triggerOptionsType} options
   */
  constructor(trigger, options) {
    this.trigger = selector(trigger)[0]; // do: edit it for multiple elements
    this.options = options;

    this.#target = options.target ? selector(options.target) : [this.trigger];

    this.#pinObj = options.pin;
    this.#animateObj = options.animate;
    this.#tweenObj = options.tween;

    this.#dir = options.dir;
    this.#isY = options.dir === 'y';
    this.#size = this.#isY ? 'h' : 'w';
    this.#dirEnd = this.#dir === 'y' ? 'yE' : 'xE';

    this.#onEnter = options.onEnter;
    this.#onLeave = options.onLeave;
    this.#onEnterBack = options.onEnterBack;
    this.#onLeaveBack = options.onLeaveBack;
    this.#onUpdate = options.onUpdate;

    this.#init();
  }

  #init() {
    if (this.#animateObj) {
      this.#ease = easingFn[this.#animateObj.ease || 'linear'];
      this.#target.forEach((element) => {
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
    tween(this.#target, this.#tweenObj);
    this._destroy();
  }

  #_pin() {
    if (inRange(this.#pinStart, this.#pinEnd, this.scroll)) {
      this.#pinOut = false;
      const dist = Math.max(0, this.scroll - this.#pinStart);
      CSSTransform(this.#target, dist, this.#isY);
    } else {
      if (!this.#pinOut) {
        if (this.scroll > this.#pinEnd) {
          const dist = this.#pinEnd - this.#pinStart;
          CSSTransform(this.#target, dist, this.#isY);
        } else {
          CSSTransform(this.#target, 0, this.#isY);
        }
        this.#pinOut = true;
      }
    }
  }

  #_update({ lerp }) {
    this.scroll = lerp;
    this.preElapsed = this.elapsed;
    this.elapsed = clamp(0, 1, normalize(this.start, this.end, this.scroll));

    if (this.#pinObj) this.#_pin();
    if (this.#animateObj) this.#_animate(this.elapsed);
    if (this.#tweenObj) if (this.start <= this.scroll) this.#_tween();

    if (this.elapsed === 1 && !this.#isOut) {
      if (this.#onLeave) {
        this.#onLeave();
      }
    }

    if (this.elapsed === 0 && !this.#isOut) {
      if (this.#onLeaveBack) {
        this.#onLeaveBack();
      }
    }

    if (inRange(0, 1, this.elapsed)) {
      this.#isOut = false;
    } else {
      this.#isOut = true;
    }

    if (this.preElapsed === 0 && !this.#isOut) {
      if (this.#onEnter) {
        this.#onEnter();
      }
    }

    if (this.preElapsed === 1 && !this.#isOut) {
      if (this.#onEnterBack) {
        this.#onEnterBack();
      }
    }

    if (this.#onUpdate) {
      this.#onUpdate({
        progress: this.elapsed,
        target: this.#target,
        trigger: this.trigger,
      });
    }
  }

  #_resize() {
    this.#pinOut = false;
    const coords = offset(this.trigger);

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
