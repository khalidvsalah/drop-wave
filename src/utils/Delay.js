import { raf } from './Raf';

export class Delay {
  #duration = 0;
  #o = 0;

  constructor({ d, o, cb }) {
    this.#duration = d;
    this.#o = o;

    this.cb = cb;
    this.on = false;
  }

  play() {
    if (this.#duration === 0) this.#done();
    else this.id = raf.push({ cb: this.#loop.bind(this), d: this.#duration });
    this.on = true;
  }

  #loop(t) {
    if (t === 1) this.#done();
  }

  destroy() {
    raf.kill(this.id);
    this.on = false;
  }

  #done() {
    if (this.cb) this.cb();
    if (this.#o) raf.push(this.#o);
    this.on = false;
  }
}
