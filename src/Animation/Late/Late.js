import { Raf } from "../../index";

export default class Late {
  constructor({ late, o, cb }) {
    this.d = late || 0;

    this.o = o;
    this.cb = cb;

    this.on = false;
    this.stop = false;
  }

  play() {
    this.on = true;
    this.stop = false;

    this.id = Raf.push({ cb: this.run.bind(this) });
    this.f = performance.now() + this.d * 1e3;
  }

  kill() {
    this.stop = true;
    this.on = false;
  }

  run(t) {
    if (t > this.f) {
      Raf.kill(this.id);
      this.Elp();
    }
  }

  Elp() {
    if (this.stop) return;
    this.on = false;

    Raf.push(this.o);
    this.cb && this.cb();
  }
}
