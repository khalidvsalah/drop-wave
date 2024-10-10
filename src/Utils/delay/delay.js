import { raf } from '../raf/raf';

export class Delay {
  #d = 0;
  #o = 0;

  /**
   * @param {{d: number, o: object, cb: Function}}
   */
  constructor({ d, o, cb }) {
    this.#d = d;
    this.#o = o;
    this.cb = cb;
    this.on = false;
  }

  play() {
    if (this.#d === 0) this.#done();
    else this.id = raf.push({ cb: this.#loop.bind(this), d: this.#d });
    this.on = true;
  }

  destroy() {
    raf.kill(this.id);
    this.on = false;
  }

  #loop(t) {
    if (t === 1) this.#done();
  }

  #done() {
    if (this.cb) this.cb();
    if (this.#o) raf.push(this.#o);
    this.on = false;
  }
}
