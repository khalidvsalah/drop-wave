import { raf } from '../../index';

/**
 * Handling Delay
 *
 * @constructor
 */
export default class Late {
  /**
   * @param {{late: Number, o: Object, cb: Function}}
   */
  constructor({ late, o, cb }) {
    this.d = late || 0;

    this.o = o;
    this.cb = cb;

    this.on = false;
    this.stop = false;
  }

  /**
   * Push to the Raf.
   */
  play() {
    this.on = true;
    this.stop = false;

    if (this.d == 0) {
      this.Elp();
    } else {
      this.id = raf.push({ cb: this.loop.bind(this) });
      this.f = performance.now() + this.d * 1e3;
    }
  }

  destroy() {
    this.stop = true;
    this.on = false;
  }

  loop(t) {
    if (t > this.f) {
      raf.kill(this.id);
      this.Elp();
    }
  }

  /**
   * On compeletion.
   */
  Elp() {
    if (this.stop) return;
    this.on = false;

    raf.push(this.o);
    this.cb && this.cb();
  }
}
