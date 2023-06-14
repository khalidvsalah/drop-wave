import { Delay, Ease, Clamp } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(ele, o) {
    this.ele = ele;
    this.o = o;

    this.completed = o.completed;
    this.raf = o.raf;

    this.mode;
    this.prog = 0;
    this.elp = 0;
    this.played = false;

    this.results = [];
    this.to();
  }

  to() {
    this.target = checkEle(this.ele);
    this.obj = !(this.target instanceof window.HTMLElement);

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay;

    this.ease = Ease[this.o.ease] ? Ease[this.o.ease] : Ease["l"];
    this.ps = this.o.p;
    this.keys = this.ps && Object.keys(this.ps);

    this.cbO = {
      cb: this.run.bind(this),
    };

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
    });

    checkProps.call(this);
  }

  run(t) {
    this.on = true;
    if (!this.st) this.st = t;

    let time = this.prog + (t - this.st) / (this.d * 1000);
    this.elp = Clamp(0, 1, time);

    this.e = Math.abs(this.dir - this.ease(this.elp));
    this.raf && this.raf(this.e);

    this.results.map((p) => {
      let cb = p.cb(this.e);
      if (this.obj) this.target[p.name] = cb;
      else this.target.style[p.name] = cb;
    });

    if (this.elp === 1) return this.kill();
  }

  control(m, n) {
    if (this.delay.on && this.mode !== m) {
      this.mode = m;
      this.delay.kill();
    }

    if (this.mode === m) return;
    this.mode = m;
    if (m === "r") {
      this.delay.cb = null;
      this.dir = 1;
    } else {
      this.dir = 0;
      if (this.start) this.delay.cb = this.start;
    }
    if (this.delay.on) return;

    if (this.on) {
      this.st = null;
      n ? (this.prog = 0) : (this.prog = 1 - this.elp);
    } else {
      this.delay.play();
    }
  }

  reverse(d) {
    this.delay.delay = d;
    this.control("r");
  }

  pause() {
    this.prog = this.elp;
  }

  resume() {
    this.st = null;
    this.delay.cb = null;
    this.delay.play();
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
    let newO = JSON.stringify(this.ps) !== JSON.stringify(o.p);
    this.delay.delay = d || 0;

    if (newO) {
      this.delay.delay = o.delay;
      this.d = o.d;

      this.ease = Ease[o.ease] || this.ease;
      this.ps = o.p;

      this.completed = o.completed;
      this.raf = o.raf;

      checkProps.call(this);

      this.mode = "r";
      this.control("p", true);
    } else {
      this.control("p");
    }
  }
}

export default Tween;
