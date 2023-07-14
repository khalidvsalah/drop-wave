import { Raf } from "../../index";

const next = function () {
  let p = this.p;
  let nr = p.arr[0];

  if (nr) nr.p(this.r.d);
  else {
    p.run = false;
    p.l = -1;
  }
};

// class Late {
//   constructor({ late, o, cb }, p) {
//     this.d = late || 0;

//     this.o = o;
//     this.cb = cb;

//     this.on = false;
//     this.stop = false;

//     this.p = p;
//   }

//   play() {
//     let p = this.p;

//     for (let i = 0; i < p.arr.length; i++) {
//       if (p.arr[i].i == this.i) console.log("Again");
//     }

//     this.i = p.l;

//     let r = { cb: this.run.bind(this), d: this.d };
//     this.r = r;

//     if (r.d == 0 || p.cl > r.d) {
//       if (!p.run) p.cl = 0;
//       Raf.push(r);
//     } else if (p.cl <= r.d) {
//       if (!p.run) Raf.push(r);
//       p.arr.push({ r, i: this.i });

//       p.run = true;
//       this.next = next.bind(this);

//       ++p.l;
//     }
//   }

//   kill() {
//     this.stop = true;
//     this.on = false;
//   }

//   run(t) {
//     if (this.stop) return true;

//     this.on = true;
//     this.stop = false;

//     if (t == 1) this.Elapsed();
//   }

//   Elapsed() {
//     let p = this.p.arr;
//     this.on = false;

//     console.log(this.i, p[1]);
//     for (let i = 0; i < p.length; i++) {
//       if (p[i].i == this.i) p.splice(i, 1);
//     }

//     this.next && this.next();
//     Raf.push(this.o);

//     this.cb && this.cb();
//   }
// }

class Late {
  constructor({ late, o, cb }) {
    this.d = late || 0;

    this.o = o;
    this.cb = cb;

    this.on = false;
    this.stop = false;

    this.r = { cb: this.run.bind(this), d: this.d };
  }

  play() {
    let p = this.p;
    let r = this.r;

    this.i = p.l;

    if (r.d == 0 || p.cl > r.d) {
      if (!p.run) p.cl = 0;
      Raf.push(r);
    } else if (p.cl <= r.d) {
      if (!p.run) Raf.push(r);
      else p.arr.push({ i: this.i, p: this.push.bind(this) });

      p.run = true;
      this.next = next.bind(this);

      ++p.l;
    }
  }

  kill() {
    this.stop = true;
    this.on = false;
  }

  push(t) {
    let p = this.p;
    for (let i = 0; i < p.arr.length; i++) {
      if (p.arr[i].i == this.i) p.arr.splice(i, 1);
    }

    Raf.push({ ...this.r, d: this.r.d - t });
    p.cl = this.r.d;
  }

  run(t) {
    if (this.stop) return true;

    this.on = true;
    this.stop = false;

    if (t == 1) this.Elp();
  }

  Elp() {
    this.on = false;

    this.next && this.next();
    this.next = null;
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
    l.p = this;

    return l;
  }
}

export default new CLate();
