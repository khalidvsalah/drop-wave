import ease from '../../Math/ease';
import { iSet } from '../methods/methods';
import props from '../../Utils/props/props';
import raf from '../../Utils/raf';
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
  constructor(element, o) {
    const stored = store(element, this);

    if (!stored) {
      targeted.call(this, element);
      this.init();
      this.play(o);
    } else stored.play(o);
  }

  /**
   * Setting up the class.
   */
  init() {
    this.elapsed = 0;
    this.dur = 0.5;
    this.prog = 0;
    this.props = [];
    this.late = new late({ cb: this.push.bind(this) });
    // if (o.from) this.props.map(({ setV, cb }) => setV(this.target, cb(0)));
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
    if (this.elapsed === 1) this.finished();
  }

  push() {
    if (this.started) {
      this.started(this.target);
      this.started = null;
    }
    if (this.oProps) {
      this.props = props(this.target, this.isObj, this.oProps, this.ease);
    }
    this.rafObj = { cb: this.run.bind(this), d: this.dur };
    this.id = raf.push(this.rafObj);
  }

  /**
   * Controaling animation (forward, reversed).
   * @param {String} m - the mode.
   * @param {Boolean} n - check if the properties has changed.
   *
   */
  control(mode, newV) {
    if (this.mode !== mode) {
      this.mode = mode;
      if (mode === 'r') this.dir = 1;
      else this.dir = 0;

      if (this.late.on) this.late.destroy();
      else {
        if (this.on) {
          if (newV) {
            this.late.play();
            this.prog = 0;
          } else {
            this.rafObj.st = null;
            this.prog = 1 - this.elapsed;
          }
        } else {
          this.late.play();
          this.prog = 0;
        }
      }
    } else if (newV) {
      if (this.late.on) this.late.destroy();
      this.late.play();
    }
  }

  // /**
  //  * @param {number} d - update delay time.
  //  *
  //  */
  // reverse(o) {
  //   this.late.d = o.late || this.late.d;

  //   if (this.index === 0) {
  //     this.start = o.start;
  //     this.completed = o.completed;
  //     this.raf = o.raf;
  //   }

  //   this.control('r');
  // }

  /**
   * (Checkt/Update) properties object
   *
   * @param {Object} o - The new properties.
   */
  play(o, mode) {
    this.started = o.started;
    this.completed = o.completed;
    this.raf = o.raf;

    if (o.late) this.late.d = o.late;
    if (o.ease) this.ease = ease(o.ease);
    if (o.d) this.dur = o.d;

    if (o.p && iSet.string(this.oProps) !== iSet.string(o.p)) {
      this.oProps = o.p;
      this.control('p', true);
    } else {
      this.oProps = o.p;
      this.control(mode, false);
    }
  }

  finished() {
    this.on = false;
    raf.kill(this.id);
    if (this.completed) {
      this.completed(this.target);
      this.completed = null;
      this.raf = null;
    }
  }
}

export default Tween;
