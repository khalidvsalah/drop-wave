import { Delay, Ease, Clamp } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(ele, o, obj) {
    this.obj = obj;
    this.ele = ele;
    this.o = o;

    this.completed = o.completed;
    this.raf = o.raf;

    this.mode;
    this.prog = 0;
    this.elp = 0;
    this.played = false;

    this.to();
  }

  to() {
    this.elements = checkEle(this.ele);

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay;

    this.ease = Ease[this.o.ease] ? Ease[this.o.ease] : Ease["l"];
    this.ps = this.o.p;
    this.keys = Object.keys(this.ps);

    this.cbO = {
      cb: this.run.bind(this),
    };

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
    });
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

      if (this.obj) this.elements[0][p.name] = cb;
      else p.element.style[p.name] = cb;
    });

    if (this.elp === 1) return this.kill();
  }

  reverse() {
    if (this.mode === "r") return;

    this.dir = 1;
    this.mode = "r";

    if (this.on) {
      this.prog = 1 - this.elp;
      this.st = null;
    } else {
      this.delay.cb = null;
      this.delay.play();
    }
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
    this.completed && this.completed();

    this.st = null;
    this.on = false;
    this.prog = 0;

    return true;
  }

  play(o) {
    let newO = JSON.stringify(this.ps) !== JSON.stringify(o.p);
    if (this.mode === "p" && !newO) return;

    this.mode = "p";
    this.dir = 0;

    if (newO) {
      this.delay.delay = o.delay;
      this.d = o.d;

      this.ease = Ease[o.ease] || this.ease;
      this.ps = o.p;

      this.completed = o.completed;
      this.raf = o.raf;
    }

    if (this.on) {
      this.st = null;

      if (newO) this.prog = 0;
      else this.prog = 1 - this.elp;
    } else {
      this.delay.play();
    }

    if (!this.played) this.delay.cb = () => checkProps.call(this, this.obj);
    else if (newO && this.on) checkProps.call(this, this.obj);
    else if (newO && !this.on)
      this.delay.cb = () => checkProps.call(this, this.obj);
    else this.delay.cb = null;

    this.played = true;
  }
}

export default Tween;
