import { Delay, Ease, Clamp } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(ele, o, obj) {
    this.obj = obj;
    this.ele = ele;
    this.o = JSON.parse(JSON.stringify(o));

    this.completed = o.completed || 0;
    this.raf = o.raf || 0;

    this.played = false;
    this.startPoint = {};
    this.prog = 0;
    this.elp = 0;

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

    // console.log(this.prod);
    let time = this.prog + (t - this.st) / (this.d * 1000);
    this.elp = Clamp(0, 1, time);

    this.e = Math.abs(this.dir - this.ease(this.elp));
    this.raf && this.raf(this.e);

    // this.ran = true;

    this.results.map((p) => {
      let cb = p.cb(this.e);

      if (this.obj) this.elements[0][p.name] = cb;
      else p.element.style[p.name] = cb;
    });

    if (this.elp === 1) return this.kill();
  }

  reverse() {
    this.dir = 1;
    this.prog = 1 - this.elp;

    if (this.on) {
      this.st = null;
    } else {
      this.delay.cb = null;
      this.delay.play();
    }

    // for (let i = 0; i < this.keys.length; i++) {
    //   this.props[this.keys[i][0]] = [
    //     this.startPoint[this.keys[i][0]],
    //     this.keys[i][1][1],
    //   ];
    // }
    // this.reverseOn = this.ran ? true : false;
    // if (this.mode !== "reverse") {
    //   this.mode = "reverse";
    //   this.delay.play();
    // }
  }

  pause() {
    this.prog = this.elp;
    // this.delay.o.pause = true;
  }

  resume() {
    this.st = null;
    this.delay.cb = null;
    this.delay.play();
    // this.delay.o.pause = false;
  }

  kill() {
    this.completed && this.completed();

    this.st = null;
    this.on = false;

    return true;
  }

  play(o) {
    this.dir = 0;
    this.props = JSON.parse(JSON.stringify(o || this.o.p));

    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
    };

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
      cb: () => checkProps.call(this, this.obj),
    });

    if (!this.on) {
      this.delay.play();
      this.prog = 0;
    } else {
      this.st = null;
      this.prog = 1 - this.elp;
    }

    // this.start && this.start();
    // this.delay.o.cb = this.run.bind(this);
    // this.delay.o.d = this.d;
    // this.delay.o.completed = this.completed;

    // if (this.mode !== "p") {
    // }
  }
}

export default Tween;
