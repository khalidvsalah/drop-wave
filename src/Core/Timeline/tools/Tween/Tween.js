import { Delay, Ease, Store } from "../../../../index";

import checkProps from "../props/checkProps";
import checkEle from "../elements/checkEle";

const S = new Store();

class Tween {
  constructor() {
    this.store = S;
  }

  to(element, o, obj) {
    this.control(element, o);
    this.obj = obj;

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
      elapsed: () => checkProps.call(this, this.obj),
    });

    return this;
  }

  control(ele, g) {
    let re = this.store.get(ele);
    if (re) {
      if (JSON.stringify(g) === JSON.stringify(re.o)) {
        this.played = true;
        return;
      } else {
        re.o.d = 0;
        re.o.pause = true;
        this.store.set(ele, { ele, o: g });
      }
    } else {
      this.store.set(ele, { ele, o: g });
    }

    this.stop = false;
  }

  // set(element, o) {
  //   checkElement.call(this, element, o);

  //   let cbO = {
  //     cb: this.run.bind(this),
  //   };

  //   this.delay = new Delay({ delay: 0, o: cbO });
  //   this.ease = Ease["l"];

  //   this.props = o.p;
  //   this.keys = Object.keys(o.p);

  //   checkProps.call(this);
  //   this.play();
  // }

  run(t) {
    if (this.stop) return true;

    let e = this.ease(t);

    this.results.map((p) => {
      if (this.obj) {
        this.elements[0][p.name] = p.cb(e);
      } else {
        p.element.style[p.name] = p.cb(e);
      }
    });

    if (t === 1) this.stop = true;
  }

  reverse(v) {
    if (v) {
      for (let i = 0; i < this.keys.length; i++) {
        let key = this.keys[i];
        this.props[key][0] = [
          this.props[key][1],
          (this.props[key][1] = this.props[key][0]),
        ][0];
      }
    }

    this.stop = true;
    checkProps.call(this, this.obj);
    this.play();
    this.stop = false;
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

  play() {
    if (this.played) return;
    this.delay.play();
  }
}

export default Tween;
