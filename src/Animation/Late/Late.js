import { Raf } from "../../index";

// let Lates = [];

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

    // this.l = Lates.length;
    let o = { cb: this.run.bind(this), d: this.late, i: this.l };

    this.control(o);
  }

  control(o) {
    // if (o.d === 0) {
    //   this.Elapsed();
    // } else {
    //   Lates[this.l] = o;

    //   let prev = Lates[this.l - 1];
    //   if (prev) {
    //     if (prev.d > this.late) {
    //       Raf.push(o);
    //       Lates.pop();
    //       return;
    //     }
    //   }

    //   this.next = () => {
    //     let next, pos;

    //     for (let i = 0; i < Lates.length; i++) {
    //       if (Lates[i].i === this.l + 1) {
    //         next = Lates[i];
    //         pos = i - 1;
    //       }
    //     }

    //     if (next) {
    //       let d = next.d - o.d;
    //       Raf.push({ cb: next.cb, d });
    //       Lates.splice(pos, 1);
    //     } else {
    //       Lates = [];
    //     }
    //   };

    //   if (this.l === 0) Raf.push(o);
    // }
    Raf.push(o);
  }

  kill() {
    this.stop = true;
    this.on = false;

    // if (this.l) {
    //   for (let i = 0; i < Lates.length; i++) {
    //     if (Lates[i].i === this.l) Lates.splice(i, 1);
    //   }
    // }
  }

  run(t) {
    if (t === 1) this.Elapsed();
  }

  Elapsed() {
    if (this.stop) return;

    this.next && this.next();
    this.cb && this.cb();

    Raf.push(this.o);

    this.on = false;
    this.st = null;
  }
}
