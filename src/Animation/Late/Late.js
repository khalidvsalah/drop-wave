import { Raf } from "../../index";

let Lates = [];

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

    let o = {
      cb: this.run.bind(this),
      d: this.late,
    };

    this.lateL = Lates.length;
    this.index = this.lateL;
    o.index = this.lateL;

    this.next = () => {
      let next;
      let pos;

      for (let i = 0; i < Lates.length; i++) {
        if (Lates[i].index === this.index + 1) {
          next = Lates[i];
          pos = i - 1;
        }
      }

      this.cb && this.cb();

      if (next) Raf.push({ cb: next.cb, d: next.d - o.d });
      Lates.splice(pos, 1);
    };

    Lates[this.index] = o;
    if (this.lateL === 0) this.id = Raf.push(o);
  }

  kill() {
    this.stop = true;
    this.on = false;

    for (let i = 0; i < this.lateL; i++) {
      if (Lates[i].index === this.index) {
        Lates.splice(i, 1);
      }
    }
  }

  run(t) {
    if (t === 1) this.Elapsed();
  }

  Elapsed() {
    if (this.stop) return;

    this.next && this.next();
    Raf.push(this.o);

    this.on = false;
    this.st = null;
  }
}
