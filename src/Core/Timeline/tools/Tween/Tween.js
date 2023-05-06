import { Delay, Ease, Store } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

const S = new Store();

function Control(ele, g) {
  let re = S.get(ele);
  let tw = re ? re : null;

  if (re) {
    if (JSON.stringify(re.o.props) !== JSON.stringify(g.p)) {
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
  constructor(element, o, obj) {
    this.obj = obj;
    this.element = element;
    this.o = o;

    this.stop = false;
    this.played = false;

    this.to();
  }

  to() {
    let ele = checkEle(this.element);
    this.elements = ele[0];

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay ? this.o.delay : 0;

    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
      completed: this.o.completed,
    };

    this.ease = this.o.ease ? Ease[this.o.ease] : Ease["l"];
    this.props = JSON.parse(JSON.stringify(this.o.p));
    this.keys = Object.entries(this.props);

    this.delay = new Delay({
      delay: this.del,
      o: this.cbO,
      elapsed: () => checkProps.call(this, this.obj),
    });

    this.play();
  }

  run(t) {
    this.e = this.ease(t);

    this.results.map((p) => {
      let cb = p.cb(this.e);

      if (this.obj) this.elements[0][p.name] = cb;
      else p.element.style[p.name] = cb;
    });

    if (t === 1) this.stop = true;
    return this.stop;
  }

  reverse() {
    for (let i = 0; i < this.keys.length; i++) {
      this.props[this.keys[i][0]] = [
        this.startPoint[this.keys[i][0]],
        this.keys[i][1][1],
      ];
    }

    this.delay.o.st = null;

    if (this.e === 1) this.stop = false;
    this.delay.play();
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

  play(f) {
    this.props = JSON.parse(JSON.stringify(this.o.p));

    this.delay.o.st = null;
    this.stop = false;

    this.delay.play();
  }
}

export default Control;
