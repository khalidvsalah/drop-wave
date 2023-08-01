import { Late, Ease, Clamp, Props } from "../../../../index";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(el, o) {
    checkEle.call(this, el);
    this.o = o;

    this.mode;
    this.prog = 0;
    this.elp = 0;

    this.to();
  }

  to() {
    this.d = this.o.d || 0.5;
    this.late = this.o.late;

    this.ease = Ease[this.o.ease] || Ease["l"];
    this.ps = this.o.p;

    this.cbO = { cb: this.run.bind(this), d: this.d };

    this.late = new Late({ late: this.late, o: this.cbO });
    this.results = Props(this.target, this.obj, this.ps);
  }

  run(t) {
    this.on = true;

    this.ti = this.prog + t;
    this.elp = Clamp(0, 1, this.ti);
    this.e = Math.abs(this.dir - this.ease(this.elp));

    this.results.map((p) => {
      let cb = p.cb(this.e);
      if (this.obj) this.target[p.name] = cb;
      else this.target.style[p.name] = cb;
    });

    this.raf && this.raf(this.e, this.target);
    if (this.elp === 1) return this.kill();
  }

  control(m, n) {
    if (this.late.on && this.mode != m) {
      this.mode = m;
      this.late.kill();
    }

    if (this.mode == m && !this.obj) return;
    this.mode = m;

    if (m == "r") {
      this.dir = 1;
      this.late.cb = null;
    } else {
      this.dir = 0;
      this.late.cb = this.start;
    }

    if (this.late.on) return;

    if (this.on) {
      this.cbO.st = null;
      n ? (this.prog = 0) : (this.prog = 1 - this.elp);
    } else {
      this.late.play();
    }
  }

  reverse(d) {
    this.late.d = typeof d == "number" ? d : this.late.d;
    this.control("r");
  }

  kill() {
    if (this.completed && this.mode == "p") this.completed();

    this.on = false;
    this.prog = 0;

    return true;
  }

  play(o) {
    this.start = o.start;
    this.completed = o.completed;
    this.raf = o.raf;

    let newO = JSON.stringify(this.ps) != JSON.stringify(o.p);

    if (newO) {
      this.late.d = o.late || 0;
      this.d = o.d;

      this.ease = Ease[o.ease] || this.ease;
      this.ps = o.p;

      this.results = Props(this.target, this.obj, this.ps);

      this.mode = "r";
      this.control("p", true);
    } else {
      this.control("p");
    }
  }
}

export default Tween;
