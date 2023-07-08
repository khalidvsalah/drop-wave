import { Late, Ease, Clamp } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(el, o) {
    this.target = checkEle.call(this, el);
    this.o = o;

    this.mode;
    this.prog = 0;
    this.elp = 0;
    this.played = false;

    this.results = [];
    this.to();
  }

  to() {
    this.d = this.o.d;
    this.late = this.o.late;

    this.ease = Ease[this.o.ease] || Ease["l"];
    this.ps = this.o.p;

    this.cbO = {
      cb: this.run.bind(this),
    };

    this.late = new Late({
      late: this.late,
      o: this.cbO,
    });

    checkProps.call(this);
  }

  run(t) {
    console.log(this.obj);
    this.on = true;
    if (!this.st) this.st = t;

    let time = this.prog + (t - this.st) / (this.d * 1000);
    this.elp = Clamp(0, 1, time);

    this.e = Math.abs(this.dir - this.ease(this.elp));

    this.results.map((p) => {
      let cb = p.cb(this.e);
      if (this.obj) this.target[p.name] = cb;
      else this.target.style[p.name] = cb;
    });

    this.raf && this.raf(this.e);
    if (this.elp === 1) return this.kill();
  }

  control(m, n) {
    if (this.late.on && this.mode !== m) {
      this.mode = m;
      this.late.kill();
    }

    if (this.mode === m && !this.obj) return;
    this.mode = m;

    if (m === "r") {
      this.late.cb = null;
      this.dir = 1;
    } else {
      this.dir = 0;
      this.late.cb = this.start;
    }

    if (this.late.on) return;

    if (this.on) {
      this.st = null;
      n ? (this.prog = 0) : (this.prog = 1 - this.elp);
    } else {
      this.late.play();
    }
  }

  reverse(d) {
    this.late.late = d;
    this.control("r");
  }

  pause() {
    this.prog = this.elp;
  }

  resume() {
    this.st = null;
    this.late.cb = null;
    this.late.play();
  }

  kill() {
    if (this.completed && this.mode === "p") this.completed();

    this.st = null;
    this.on = false;
    this.prog = 0;

    return true;
  }

  play(o, d) {
    this.start = o.start;
    this.completed = o.completed;
    this.raf = o.raf;

    let newO = JSON.stringify(this.ps) !== JSON.stringify(o.p);
    this.late.late = d || 0;

    if (newO) {
      this.late.late = o.late;
      this.d = o.d;

      this.ease = Ease[o.ease] || this.ease;
      this.ps = o.p;

      checkProps.call(this);

      this.mode = "r";
      this.control("p", true);
    } else {
      this.control("p");
    }
  }
}

export default Tween;
