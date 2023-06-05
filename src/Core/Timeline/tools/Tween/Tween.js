import { Delay, Ease } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

class Tween {
  constructor(element, o, obj) {
    this.obj = obj;
    this.element = element;
    this.o = JSON.parse(JSON.stringify(o));

    this.completed = o.completed || 0;
    this.raf = o.raf || 0;

    this.played = false;
    this.mode = false;
    this.startPoint = {};

    this.to();
  }

  to() {
    this.elements = checkEle(this.element);

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay ? this.o.delay : 0;

    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
      completed: this.completed,
    };

    this.ease = this.o.ease ? Ease[this.o.ease] : Ease["l"];
    this.props = JSON.parse(JSON.stringify(this.o.p));
    this.keys = Object.entries(this.props);

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
      elapsed: () => checkProps.call(this, this.obj),
    });
  }

  run(t) {
    this.ran = true;
    this.running = true;
    this.e = this.ease(t);

    this.raf && this.raf(this.e);
    this.results.map((p) => {
      let cb = p.cb(this.e);

      if (this.obj) this.elements[0][p.name] = cb;
      else p.element.style[p.name] = cb;
    });

    if (t === 1) this.running = false;
  }

  reverse() {
    for (let i = 0; i < this.keys.length; i++) {
      this.props[this.keys[i][0]] = [
        this.startPoint[this.keys[i][0]],
        this.keys[i][1][1],
      ];
    }

    this.reverseOn = this.ran ? true : false;

    if (this.mode !== "reverse") {
      this.mode = "reverse";
      this.delay.play();
    }
  }

  pause() {
    this.delay.o.pause = true;
  }

  resume() {
    this.delay.o.pause = false;
  }

  play(o) {
    this.props = JSON.parse(JSON.stringify(o || this.o.p));

    this.delay.o.cb = this.run.bind(this);
    this.delay.o.d = this.d;
    this.delay.o.completed = this.completed;

    if (this.mode !== "play") {
      this.delay.play();
      this.mode = "play";
    }
  }
}

export default Tween;
