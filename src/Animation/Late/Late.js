import { Raf } from "../../index";

export default class Late {
  constructor({ late, o, cb }) {
    this.late = late || 0;

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
      d: this.late,
    });
  }

  kill() {
    this.stop = true;
    this.on = false;
  }

  run(t) {
    if (t === 1) this.Elapsed();
  }

  Elapsed() {
    if (this.stop) return;
    this.on = false;
    this.st = null;

    this.o && Raf.push(this.o);
    this.cb && this.cb();
  }
}
