import { units } from '../helpers/units.js';
import { observer } from '../utils/Observer.js';
import { processing } from '../processing/processing.js';
import { offset } from '../methods/coordinate.js';
import { css } from '../methods/css.js';
import { clamp, normalize } from '../math/math.js';
import { ease } from '../math/easing.js';
import { tween } from '../tween/tween.js';

export default class Trigger {
  #pin;
  #ease;
  #animate;
  #tween;
  #onUpdate;
  #dir;
  #isVertical;
  #size;
  #dirEnd;
  #pinStart;
  #pinEnd;

  /**
   * @param {HTMLElement} target
   * @param {TRIGGER_OPTIONS} options
   */
  constructor(target, options) {
    this.target = target;
    this.options = options;

    this.#pin = options.pin;
    this.#ease = ease[options.ease || 'linear'];
    this.#animate = options.animate;
    this.#tween = options.tween;
    this.#onUpdate = options.onUpdate;

    this.#dir = options.dir;
    this.#isVertical = options.dir === 'y';
    this.#size = this.#isVertical ? 'h' : 'w';
    this.#dirEnd = this.#dir === 'y' ? 'yE' : 'xE';

    this.pined = false;

    this.#init();
  }

  #init() {
    if (this.#animate) {
      this.lerps = processing(this.target, this.#animate);
    }

    this._resize();
    this.iupdate = observer.subscribe(
      this.options.channel,
      this.#_update.bind(this)
    );
    this.iresize = observer.subscribe('resize', this._resize.bind(this));
  }

  #_scroll(elapsed) {
    this.lerps.map(({ cb, setValue }) => setValue(cb(this.#ease(elapsed))));
  }

  #_tween() {
    if (this.#tween) tween(this.target, this.#tween);
    this._destroy();
  }

  #_pin() {
    if (this.pined) {
      if (!(this.coord >= this.#pinEnd)) {
        const dist = Math.max(0, this.coord - this.#pin.scroll);
        if (this.#isVertical) {
          css.set(this.target, 'transform', `translate3d(0, ${dist}px, 0)`);
        } else {
          css.set(this.target, 'transform', `translate3d(${dist}px, 0, 0)`);
        }
      }
    }
    if (this.coord < this.#pinStart) {
      this.pined = false;
    } else if (this.coord >= this.#pinStart && !this.pined) {
      this.#pin.scroll = this.coord;
      this.pined = true;
    }
  }

  #_update({ lerp }) {
    this.coord = lerp;
    const elapsed = clamp(
      0,
      1,
      normalize(this.startPoint, this.endPoint, this.coord)
    );

    if (this.#pin) this.#_pin();
    if (this.#animate) this.#_scroll(elapsed);
    if (this.#tween) if (this.startPoint <= this.coord) this.#_tween();
    if (this.#onUpdate) this.#onUpdate(elapsed, this.target);
  }

  _resize() {
    const coords = offset(this.target);

    if (this.#animate || this.#tween) {
      this.startPoint =
        coords[this.#dir] + units(this.options.start, coords[this.#size]);
      this.endPoint =
        coords[this.#dirEnd] + units(this.options.end, coords[this.#size]);
    }
    if (this.#pin) {
      this.#pinStart =
        coords[this.#dir] + units(this.#pin.start, coords[this.#size]);
      this.#pinEnd =
        coords[this.#dirEnd] + units(this.#pin.end, coords[this.#size]);
    }
  }

  _destroy() {
    this.iresize.unsubscribe();
    this.iupdate.unsubscribe();
  }
}
