import { Delay, Ease, Store } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

const S = new Store();

function Control(ele, g) {
  let re = S.get(ele);
  if (re) {
    if (JSON.stringify(re.o.p) === JSON.stringify(g.o.p)) {
      g.played = true;
    } else {
      re.kill();
      S.set(ele, g);
    }
  } else {
    S.set(ele, g);
  }
}

class Tween {
  constructor() {
    this.stop = false;
    this.played = false;
  }

  to(element, o, obj) {
    this.obj = obj;
    this.element = element;

    let ele = checkEle(element);

    this.elements = Array.isArray(ele) ? ele : [ele];

    this.o = o;

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay ? this.o.delay : 0;

    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
      completed: this.o.completed,
    };

    this.ease = this.o.ease ? Ease[this.o.ease] : Ease["l"];
    this.props = this.o.p;
    this.keys = Object.keys(this.props);

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
    });

    Control(element, this);
    return this;
  }

  run(t) {
    this.e = Math.abs(this.ease(t) - this.reEase);

    this.results.map((p) => {
      if (this.obj) this.elements[0][p.name] = p.cb(this.e);
      else p.element.style[p.name] = p.cb(this.e);
    });

    if (t === 1) this.stop = true;
    return this.stop;
  }

  reverse() {
    this.played = false;
    this.stop = false;

    this.o.p = {};
    this.play("r");
  }

  pause() {
    this.delay.o.pause = true;
  }

  resume() {
    this.delay.o.pause = false;
  }

  kill() {
    this.stop = true;
  }

  play(r) {
    this.delay.o.st = null;
    if (r === "r") {
      this.reEase = 1;
      this.delay.elapsed = null;
    } else {
      this.reEase = 0;
      this.delay.elapsed = () => checkProps.call(this, this.obj);
    }

    !this.played && this.delay.play();
  }
}

export default Tween;
