import { Delay, Ease, Store } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

const S = new Store();

function tweenController(item, g) {
  let re = S.get(item);
  let tw = re ? re : null;

  if (re) {
    if (JSON.stringify(re.props) !== JSON.stringify(g.p)) {
      tw.mode = undefined;

      tw.delay.delay = typeof g.delay === "number" ? g.delay : re.del;
      tw.ease = Ease[g.ease] || re.ease;
      tw.d = typeof g.d === "number" ? g.d : re.d;
      tw.completed = g.completed || re.completed;

      tw.play(g.p);
    }
  } else {
    tw = new Tween(item, g);
    S.set(item, tw);
    tw.play();
  }

  return {
    reverse: (delay) => {
      tw.delay.delay = typeof delay === "number" ? delay : tw.del;
      tw.reverse();
    },
    pause: () => {
      tw.pause();
    },
    resume: () => {
      tw.resume();
    },
    item,
    tw,
  };
}

function Control(items, g) {
  if (items.length) {
    return [...items].map((item, k) => {
      if (k === 0) {
        return tweenController(item, g);
      } else {
        let delay = g.delay || 0;
        let add = delay + (g.stagger || 0) * k;

        return tweenController(item, { ...g, delay: add });
      }
    });
  } else {
    return tweenController(items, g);
  }
}

class Tween {
  constructor(element, o, obj) {
    this.obj = obj;
    this.element = element;
    this.o = JSON.parse(JSON.stringify(o));

    this.played = false;
    this.mode = false;
    this.startPoint = {};

    this.to();
  }

  to() {
    this.elements = checkEle(this.element);

    this.d = this.o.d ? this.o.d : 0.5;
    this.del = this.o.delay ? this.o.delay : 0;
    this.completed = this.o.completed || 0;
    this.raf = this.o.raf;

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

  destroy() {}

  play(newO) {
    this.props = JSON.parse(JSON.stringify(newO || this.o.p));

    this.delay.o.cb = this.run.bind(this);
    this.delay.o.d = this.d;
    this.delay.o.completed = this.completed;

    if (this.mode !== "play") {
      this.delay.play();
      this.mode = "play";
    }
  }
}

export default Control;
