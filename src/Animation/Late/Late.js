import { Raf } from "../../index";

const next = function () {
  let p = this.p;
  let nr = p.arr.find(({ i }) => i == this.i + 1);

  if (nr) {
    nr = nr.r;
    Raf.push({ ...nr, d: nr.d - this.r.d });
    p.cl = this.r.d;
  } else {
    p.run = false;
  }
};

class Late {
  constructor({ late, o, cb }, p) {
    this.d = late || 0;

    this.o = o;
    this.cb = cb;

    this.on = false;
    this.stop = false;

    this.p = p;
  }

  play() {
    this.on = true;
    this.stop = false;

    let r = { cb: this.run.bind(this), d: this.d };
    this.r = r;

    let p = this.p;

    this.i = p.l;

    if (r.d == 0 || p.cl > r.d) {
      Raf.push(r);
    } else if (p.cl <= r.d) {
      if (!p.run) {
        Raf.push(r);
      } else {
        p.arr.push({ r, i: this.i });
      }

      p.run = true;
      this.next = next.bind(this);
      ++p.l;
    }
  }

  kill() {
    this.stop = true;
    this.on = false;
  }

  run(t) {
    if (t == 1) this.Elapsed();
  }

  Elapsed() {
    if (this.stop) return;

    this.on = false;
    this.st = null;

    this.next && this.next();
    let p = this.p.arr;

    for (let i = 0; i < p.length; i++) {
      if (p[i].i == this.i) p.splice(i, 1);
    }

    Raf.push(this.o);
    this.cb && this.cb();
  }
}

class CLate {
  constructor() {
    this.cl = 0;
    this.l = -1;
    this.arr = [];
  }

  add(o) {
    let l = new Late(o, this);
    return l;
  }
}

export default new CLate();
