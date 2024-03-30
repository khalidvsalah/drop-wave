import ease from '../../Math/ease';
import props from '../../Utils/props/props';
import raf from '../../Utils/raf';
import { clamp } from '../../Math/math';
import late from '../late/late';
import targeted from './tools/targeted';
import store from './tools/stored';
import compare from './tools/compare';

/**
 * Tween
 *  @constructor
 */
class Tween {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   */
  constructor(element) {
    const stored = store(element, this);
    return stored;
  }

  /**
   * Setting up the class.
   */
  init(element) {
    targeted.call(this, element);

    this.call = -1;

    this.props = [];
    this.queue = [];

    this.prog = 0;
    this.elapsed = 0;
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

  push(roll) {
    this.destroy();

    this.dir = roll.dir;
    this.mode = roll.mode;

    if (this.started) {
      this.started(this.target);
      this.started = null;
    }

    if (roll.oProps) {
      this.oProps = roll.oProps;
      this.props = props(this.target, this.isObj, roll.oProps, ease(roll.ease));
      this.prog = 0;
    } else this.prog = 1 - this.elapsed;

    this.rafObj = { cb: this.run.bind(this), d: roll.d };
    this.id = raf.push(this.rafObj);
  }

  /**
   * Controaling animation (forward, reversed).
   * @param {String} m - the mode.
   * @param {Boolean} n - check if the properties has changed.
   *
   */
  control() {
    const roll = this.queue[this.call];

    if (roll.oProps) {
      if (compare(this.oProps, roll.oProps)) roll.oProps = undefined;
      this.late = new late({ cb: this.push.bind(this, roll), d: roll.late });
      this.late.play();
    } else if (this.mode !== roll.mode) {
      if (this.late.on) this.late.destroy();
      this.late = new late({ cb: this.push.bind(this, roll), d: roll.late });
      this.late.play();
    }
  }

  /**
   * (Checkt/Update) properties object
   *
   * @param {Object} o - The new properties.
   */
  play(o, mode) {
    this.call++;

    this.started = o.started;
    this.completed = o.completed;
    this.raf = o.raf;

    this.queue.push({
      d: o.d,
      late: o.late,
      ease: o.ease,
      oProps: o.p,
      mode,
      dir: mode === 'r' ? 1 : 0
    });

    this.control();
  }

  destroy() {
    this.on = false;
    raf.kill(this.id);
  }

  finished() {
    this.destroy();
    if (this.completed) {
      this.completed(this.target);
      this.completed = null;
      this.raf = null;
    }
  }
}

export default Tween;
