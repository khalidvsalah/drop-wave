import { Delay, Ease, Clamp } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(ele, o, obj) {
    this.obj = obj;
    this.ele = ele;
    this.o = o;
    this.prog = 0;
    this.elp = 0;
    this.mode;

    this.to();
  }

  to() {
    this.elements = checkEle(this.ele);

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay;

    this.ease = Ease[this.o.ease] ? Ease[this.o.ease] : Ease["l"];
    this.props = JSON.parse(JSON.stringify(this.o.p));
    this.keys = Object.entries(this.props);
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
    this.prog = 1 - this.elp;
    this.mode = "r";

    if (this.on) {
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
    if (this.mode === "p") return;
    if (JSON.stringify(this.props) !== JSON.stringify(o.p)) {
      this.delay.delay = o.delay;
      this.ease = Ease[obj.ease] || this.ease;
      this.d = o.d || stored.d;
      this.completed = obj.completed || 0;
      this.raf = obj.raf || 0;
    }

    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
    };

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
      cb: () => checkProps.call(this, this.obj),
    });

    this.mode = "p";
    this.dir = 0;

    if (this.on) {
      this.st = null;
      this.prog = 1 - this.elp;
    } else {
      this.delay.play();
    }
  }
}

export default Tween;
