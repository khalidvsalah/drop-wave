import { raf } from './Raf';

export class Delay {
  #dur = 0;
  #o = 0;

  constructor({ d, o, cb }) {
    this.#dur = d;
    this.#o = o;

    this.cb = cb;
    this.on = false;
  }

  play() {
    this.id = raf.push({ cb: this.#loop.bind(this), d: this.#dur });
    this.on = true;
  }

  #loop(t) {
    if (t === 1) this.#done();
  }

  #done() {
    if (this.cb) this.cb();
    if (this.#o) raf.push(this.#o);
    this.on = false;
  }

  _destroy() {
    raf.kill(this.id);
    this.on = false;
  }
}
