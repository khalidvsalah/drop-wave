import { Raf, Clamp } from "../../index";

export default class Delay {
  constructor({ delay, o, cb }) {
    this.delay = delay;
    this.o = o;
    this.cb = cb;
    this.on = false;
  }

  play() {
    this.on = true;
    Raf.push({
      cb: this.run.bind(this),
    });
  }

  run(t) {
    if (!this.st) this.st = t;
    let time = (t - this.st) / (this.delay * 1000);
    let elp = isNaN(time) ? 1 : Clamp(0, 1, time);

    if (elp === 1) {
      this.Elapsed();
      return true;
    }
  }

  Elapsed() {
    this.on = false;
    this.st = null;

    this.o && Raf.push(this.o);
    this.cb && this.cb();
  }
}
