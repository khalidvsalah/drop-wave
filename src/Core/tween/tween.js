import ease from '../../Math/ease';
import props from '../../Utils/props/props';
import raf from '../../Utils/raf/raf';
import { clamp } from '../../Math/math';
import late from '../late/late';
import targeted from './tools/targeted';
import stored from './tools/stored';
import compare from './tools/compare';

class Tween {
  /**
   * Tween
   *
   * @param {HTMLElement} element - tweened element
   */
  constructor(element) {
    const isStored = stored(element, this);
    return isStored;
  }

  /**
   * @param {HTMLElement} element - tweened element
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
   * Looping over targeted element tweens.
   *
   * @param {number} t - time.
   */
  run(t) {
    this.on = true;
    this.elapsed = clamp(0, 1, this.prog + t);

    const dir = Math.abs(this.dir - this.elapsed);
    const from = Math.abs(dir - this.from);
    this.props.map(({ setV, cb }) => setV(this.target, cb(from)));

    this.raf && this.raf(dir, this.target);
    if (this.elapsed === 1) this.finished();
  }

  /**
   * Fire Next update
   *
   * @param {object} roll - time.
   */
  push(roll) {
    this.destroy();

    this.dir = roll.dir;
    this.mode = roll.mode;
    this.from = roll.from ? 1 : 0;

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
   * Handling class actions [play, reverse, updates]
   */
  control() {
    const roll = this.queue[this.call];
    if (compare(this.oProps, roll.oProps)) roll.oProps = undefined;
    else {
      this.late = new late({ cb: this.push.bind(this, roll), d: roll.late });
      this.late.play();
    }

    if (this.mode !== roll.mode) {
      if (this.late.on) this.late.destroy();
      this.late = new late({ cb: this.push.bind(this, roll), d: roll.late });
      this.late.play();
    }
  }

  /**
   * Update properties object
   *
   * @param {object} o - The new properties.
   * @param {string} mode - [play: forward, reverse].
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
      from: o.from,
      dir: mode === 'r' ? 1 : 0
    });

    this.control();
  }

  /**
   * destroy tweening
   */
  destroy() {
    this.on = false;
    raf.kill(this.id);
  }

  /**
   * After tweening finished
   */
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
