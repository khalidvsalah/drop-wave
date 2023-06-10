import { Raf, Clamp } from "../../index";

export default class Delay {
  constructor({ delay, o, cb }) {
    this.delay = delay || 0;
    this.o = o;
    this.cb = cb;
    this.on = false;
    this.stop = false;
  }

  play() {
    this.on = true;
    this.stop = false;
    Raf.push({
      cb: this.run.bind(this),
    });
  }

  kill() {
    this.stop = true;
    this.on = false;
  }

  run(t) {
    if (!this.st) this.st = t;
    let time = (t - this.st) / (this.delay * 1000);
    let elp = isFinite(time) ? Clamp(0, 1, time) : 1;

    if (elp === 1) {
      this.Elapsed();
      return true;
    }
  }

  Elapsed() {
    if (this.stop) return;
    this.on = false;
    this.st = null;

    this.o && Raf.push(this.o);
    this.cb && this.cb();
  }
}
