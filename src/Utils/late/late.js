import { raf } from '../raf/raf';

export class Late {
  /**
   * @param {{d: number, o: object, cb: Function}}
   */
  constructor({ d, o, cb }) {
    this.d = d || 0;

    this.o = o;
    this.cb = cb;

    this.on = false;
  }

  play() {
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

  Elp() {
    this.on = false;
    if (this.cb) this.cb();
    if (this.o) raf.push(this.o);
  }
}
