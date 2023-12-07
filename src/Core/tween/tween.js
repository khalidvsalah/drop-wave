import { late, clamp, props, iSet, scrub } from '../../index';

import targeted from './tools/targeted';
import stored from './tools/stored';

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
    const sT = stored.call(this, el);

    if (!sT) {
      targeted.call(this, el);
      this.init(o);
    } else {
      return sT;
    }
  }

  /**
   * Setting up the class.
   */
  init(o) {
    this.o = o;

    this.gui = o.gui;

    this.mode;
    this.prog = 0;
    this.elpased = 0;
    this.dir = 0;

    this.d = o.d;
    this.late = o.late;

    this.props = o.p;
    this.props.ease = o.ease || 'l';

    this.lateO = { cb: this.run.bind(this), d: this.d };

    this.late = new late({ late: this.late, o: this.lateO });
    this.properties = props(this.target, this.obj, this.props);
  }

  /**
   * Loop.
   * @param {Number} t - elapsed time.
   */
  run(t) {
    this.on = true;

    this.rest = this.prog + t;
    this.elpased = clamp(0, 1, this.rest);

    this.e = Math.abs(this.dir - this.elpased);
    this.properties.map(({ setV, cb }) => setV(this.target, cb(this.e)));

    this.raf && this.raf(this.e, this.target);
    if (this.elpased === 1) return this.destroy();
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

    this.late.cb = () => {
      if (this.start) this.start(this.target);
    };

    if (this.late.on) return;

    if (this.on) {
      this.lateO.st = null;

      if (n) this.prog = 0;
      else this.prog = 1 - this.elpased;
    } else {
      this.late.play();
    }
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
    if (this.gui) {
      scrub(this.run.bind(this));
      return;
    }

    this.index = i;

    if (this.index === 0) {
      this.start = o.start;
      this.completed = o.completed;
      this.raf = o.raf;
    }

    if (iSet.string(this.props) !== iSet.string(o.p)) {
      this.late.d = o.late || 0;
      this.lateO.d = o.d;

      this.props = o.p;
      this.props.ease = this.o.ease || this.props.ease;

      this.properties = props(this.target, this.obj, this.props);

      this.mode = 'r';
      this.control('p', true);
    } else {
      this.control('p');
    }
  }

  destroy() {
    this.on = false;
    this.prog = 0;

    if (this.completed) this.completed(this.target);
    return true;
  }
}

export default Tween;
