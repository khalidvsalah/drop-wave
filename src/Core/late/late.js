import raf from '../../Utils/raf';

/**
 * Handling Delay
 *
 * @constructor
 */
export default class Late {
  /**
   * @param {{late: Number, o: Object, cb: Function}}
   */
  constructor({ d, o, cb }) {
    this.d = d || 0;

    this.o = o;
    this.cb = cb;

    this.on = false;
  }

  /**
   * Push to the Raf.
   */
  play() {
    // console.log('late', this.d);
    this.on = true;
    if (this.d === 0) this.Elp();
    else this.id = raf.push({ cb: this.loop.bind(this), d: this.d });
  }

  destroy() {
    raf.kill(this.id);
    this.on = false;
  }

  loop(t) {
    if (t === 1) this.Elp();
  }

  /**
   * On compeletion.
   */
  Elp() {
    this.on = false;
    if (this.o) raf.push(this.o);
    if (this.cb) this.cb();
  }
}
