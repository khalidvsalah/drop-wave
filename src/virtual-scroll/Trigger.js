import { toPixels } from '../helpers/handleUnits';
import selector from '../helpers/selector';
import { observer } from '../utils/Observer';
import { processing } from '../processing/processing';
import { offset } from '../methods/coordinate';
import { clamp, normalize, inRange } from '../math/math';
import { easingFn } from '../math/easing/index';
import { tween } from '../core/tween/tween';
import { CSSTransform } from './utils/helpers';

export default class Trigger {
  #ease;
  #trigger;

  #pin;
  #animate;
  #tween;

  #dir;
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

    this.#trigger = options.trigger ? selector(options.trigger) : [target];
    this.#ease = easingFn[options.ease || 'linear'];

    this.#pin = options.pin;
    this.#animate = options.animate;
    this.#tween = options.tween;

    this.#dir = options.dir;
    this.#isY = options.dir === 'y';
    this.#size = this.#isY ? 'h' : 'w';
    this.#dirEnd = this.#dir === 'y' ? 'yE' : 'xE';

    this.#onUpdate = options.onUpdate;

    this.#init();
  }

  #init() {
    if (this.#animate) {
      this.props = [];
      this.#trigger.forEach((element) => {
        this.props.push(processing(element, this.#animate));
      });
    }

    this.#iresize = observer.subscribe('resize', this.#_resize.bind(this));
    this.#_resize();
    this.#iupdate = observer.subscribe(
      this.options.channel,
      this.#_update.bind(this)
    );
  }

  #_scroll(elapsed) {
    this.props.map((prop) => {
      prop.forEach(({ setValue, cb }) => {
        setValue(cb(this.#ease(elapsed)));
      });
    });
  }

  #_tween() {
    tween(this.#trigger, this.#tween);
    this._destroy();
  }

  #_pin() {
    if (inRange(this.#pinStart, this.#pinEnd, this.scroll)) {
      this.#pinOut = false;
      const dist = Math.max(0, this.scroll - this.#pinStart);
      CSSTransform(this.target, dist, this.#isY);
    } else {
      if (!this.#pinOut) {
        if (this.scroll > this.#pinEnd) {
          const dist = this.#pinEnd - this.#pinStart;
          CSSTransform(this.target, dist, this.#isY);
        } else {
          CSSTransform(this.target, 0, this.#isY);
        }
        this.#pinOut = true;
      }
    }
  }

  #_update({ lerp }) {
    this.scroll = lerp;
    const elapsed = clamp(0, 1, normalize(this.start, this.end, this.scroll));

    if (this.#pin) this.#_pin();
    if (this.#animate) this.#_scroll(elapsed);
    if (this.#tween) if (this.start <= this.scroll) this.#_tween();
    if (this.#onUpdate) this.#onUpdate(elapsed, this.target);
  }

  #_resize() {
    this.#pinOut = false;
    const coords = offset(this.target);

    if (this.#animate || this.#tween) {
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

    if (this.#pin) {
      const start =
        typeof this.#pin.start === 'function'
          ? this.#pin.start(coords)
          : coords[this.#dir] +
            toPixels(this.#pin.start || '0', coords[this.#size]).pixels;
      const end =
        typeof this.#pin.end === 'function'
          ? this.#pin.end(coords)
          : coords[this.#dirEnd] +
            toPixels(this.#pin.end || '0', coords[this.#size]).pixels;

      this.#pinStart = start;
      this.#pinEnd = end;
    }
  }

  _destroy() {
    this.#iresize.unsubscribe();
    this.#iupdate.unsubscribe();
  }
}
