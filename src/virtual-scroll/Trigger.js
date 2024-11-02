import { toPixels } from '../helpers/handleUnits.js';
import { observer } from '../utils/Observer.js';
import { processing } from '../processing/processing.js';
import { offset } from '../methods/coordinate.js';
import { clamp, normalize, inRange } from '../math/math.js';
import { ease } from '../math/easing.js';
import { tween } from '../tween/tween.js';
import XY from './utils/XY.js';

export default class Trigger {
  #ease;
  #trigger;

  #pin;
  #animate;
  #tween;

  #dir;
  #isVertical;
  #size;
  #dirEnd;

  #pinStart;
  #pinEnd;

  #onUpdate;

  /**
   * @param {HTMLElement} target
   * @param {TRIGGER_OPTIONS} options
   */
  constructor(target, options) {
    this.target = target;
    this.options = options;

    this.#trigger = options.trigger
      ? options.trigger.length
        ? options.trigger
        : [options.trigger]
      : [target];
    this.#ease = ease[options.ease || 'linear'];

    this.#pin = options.pin;
    this.#animate = options.animate;
    this.#tween = options.tween;

    this.#dir = options.dir;
    this.#isVertical = options.dir === 'y';
    this.#size = this.#isVertical ? 'h' : 'w';
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

    this._resize();
    this.iupdate = observer.subscribe(
      this.options.channel,
      this.#_update.bind(this)
    );
    this.iresize = observer.subscribe('resize', this._resize.bind(this));
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
    if (inRange(this.#pinStart, this.#pinEnd, this.coord)) {
      this.pinOut = false;
      const dist = Math.max(0, this.coord - this.#pinStart);
      XY(this.target, dist, this.#isVertical);
    } else {
      if (!this.pinOut) {
        if (this.coord > this.#pinEnd) {
          const dist = this.#pinEnd - this.#pinStart;
          XY(this.target, dist, this.#isVertical);
        } else {
          XY(this.target, 0, this.#isVertical);
        }
        this.pinOut = true;
      }
    }
  }

  #_update({ lerp }) {
    this.coord = lerp;
    const elapsed = clamp(0, 1, normalize(this.start, this.end, this.coord));

    if (this.#pin) this.#_pin();
    if (this.#animate) this.#_scroll(elapsed);
    if (this.#tween) if (this.start <= this.coord) this.#_tween();
    if (this.#onUpdate) this.#onUpdate(elapsed, this.target);
  }

  _resize() {
    const coords = offset(this.target);

    if (this.#animate || this.#tween) {
      this.start =
        coords[this.#dir] +
        toPixels(this.options.start || '0', coords[this.#size]).pixels;
      this.end =
        coords[this.#dirEnd] +
        toPixels(this.options.end || '0', coords[this.#size]).pixels;
    }
    if (this.#pin) {
      this.#pinStart =
        coords[this.#dir] +
        toPixels(this.#pin.start || 0, coords[this.#size]).pixels;
      this.#pinEnd =
        coords[this.#dirEnd] +
        toPixels(this.#pin.end || 0, coords[this.#size]).pixels;
    }
  }

  _destroy() {
    this.iresize.unsubscribe();
    this.iupdate.unsubscribe();
  }
}
