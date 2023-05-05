import { Delay, Ease, Store } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

const S = new Store();

function Control(ele, g) {
  let re = S.get(ele);
  let tw = re ? re : null;

  if (re) {
    if (JSON.stringify(re.o.p) !== JSON.stringify(g.p)) {
      re.destroy();

      tw = new Tween(ele, g);
      S.set(ele, tw);

      tw.play();
    }
  } else {
    tw = new Tween(ele, g);
    S.set(ele, tw);

    tw.play();
  }

  return {
    reverse: () => {
      tw.reverse();
    },
    pause: () => {
      tw.pause();
    },
    resume: () => {
      tw.resume();
    },
    ele,
  };
}

class Tween {
  constructor(element, o, obj = false) {
    this.obj = obj;
    this.element = element;
    this.o = o;

    this.stop = false;
    this.played = false;

    this.to();
  }

  to() {
    let ele = checkEle(this.element);
    this.elements = Array.isArray(ele) ? ele : [ele];

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

    return this;
  }

  run(t) {
    this.e = Math.abs(this.ease(t) - this.reEase);

    this.results.map((p) => {
      let cb = p.cb(this.e);
      if (this.obj) this.elements[0][p.name] = cb;
      else p.element.style[p.name] = cb;
    });

    if (t === 1) this.stop = true;
    return this.stop;
  }

  reverse() {
    this.played = false;
    this.stop = false;

    console.log(this.startPoint);
    // this.play("r");
  }

  pause() {
    this.delay.o.pause = true;
  }

  resume() {
    this.delay.o.pause = false;
  }

  destroy() {
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
    this.played = true;
  }
}

export default Control;
