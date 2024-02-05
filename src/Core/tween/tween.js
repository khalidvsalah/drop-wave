import { iSet } from '../methods/methods';
import props from '../../Utils/props/props';
import { clamp } from '../../Math/math';
import late from '../late/late';
import targeted from './tools/targeted';
import store from './tools/stored';

/**
 * Tween
 *  @constructor
 */
class Tween {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   */
  constructor(el, o) {
    const stored = store.call(this, el);

    if (!stored) {
      targeted.call(this, el);
      this.init(o);
    } else return stored;
  }

  /**
   * Setting up the class.
   */
  init(o) {
    this.o = o;

    this.mode;
    this.prog = 0;
    this.elapsed = 0;
    this.dir = 0;

    this.d = o.d;
    this.late = o.late;

    this.oProps = o.p;
    this.lateO = { cb: this.run.bind(this), d: this.d };

    this.late = new late({ late: this.late, o: this.lateO });
    this.props = props(this.target, this.obj, o.p);
  }

  /**
   * Loop.
   * @param {Number} t - elapsed time.
   */
  run(t) {
    this.on = true;
    this.elapsed = clamp(0, 1, this.prog + t);

    const e = Math.abs(this.dir - this.elapsed);
    this.props.map(({ setV, cb }) => setV(this.target, cb(e)));

    this.raf && this.raf(e, this.target);
    if (this.elapsed == 1) return this.destroy();
  }

  /**
   * Controaling animation (forward, reversed).
   * @param {String} m - the mode.
   * @param {Boolean} n - check if the properties has changed.
   *
   */
  control(mode, n) {
    if (this.late.on && this.mode !== mode) {
      this.mode = mode;
      this.late.destroy();
    }

    //  && !this.obj
    if (this.mode === mode) return;
    this.mode = mode;

    if (mode === 'r') this.dir = 1;
    else this.dir = 0;

    this.late.cb = () => this.start && this.start(this.target);
    if (this.late.on) return;

    if (this.on) {
      this.lateO.st = null;
      if (n) this.prog = 0;
      else this.prog = 1 - this.elapsed;
    } else this.late.play();
  }

  /**
   * @param {number} d - update delay time.
   *
   */
  reverse(o) {
    this.late.d = o.late || this.late.d;

    if (this.index === 0) {
      this.start = o.start;
      this.completed = o.completed;
      this.raf = o.raf;
    }

    this.control('r');
  }

  /**
   * (Checkt/Update) properties object
   *
   * @param {Object} o - The new properties.
   */
  play(o, i) {
    this.index = i;
    if (this.index === 0) {
      this.start = o.start;
      this.completed = o.completed;
      this.raf = o.raf;
    }

    if (iSet.string(this.oProps) != iSet.string(o.p)) {
      this.late.d = o.late || 0;
      this.lateO.d = o.d;

      this.oProps = o.p;
      this.props = props(this.target, this.obj, o.p);

      this.mode = 'r';
      this.control('p', true);
    } else this.control('p');
  }

  destroy() {
    this.on = false;
    this.prog = 0;

    if (this.completed) this.completed(this.target);
    return true;
  }
}

export default Tween;
