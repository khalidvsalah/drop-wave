import { Delay, Ease, Store } from "../../../../index";
import checkProps from "../props/checkProps";

const S = new Store();
class Tween {
  constructor(element, o, obj) {
    this.store = S;
    this.obj = obj;
    this.to(element, o, obj);
  }

  to(element, o) {
    this.store.set(element, this);
    this.stop = false;

    this.elements = Array.isArray(element) ? element : [element];
    this.o = o;

    this.d = this.o.d ? this.o.d : 500;
    this.cbO = {
      cb: this.run.bind(this),
      d: this.d * 1000,
      completed: this.o.completed,
    };

    this.ease = this.o.ease ? Ease[this.o.ease] : Ease["l"];

    this.props = this.o.p;
    this.keys = Object.keys(this.props);
    this.del = this.o.delay ? this.o.delay : 0;
    this.delay = new Delay({
      delay: this.del * 1000,
      o: this.cbO,
      elapsed: () => checkProps.call(this, this.obj),
    });

    return this;
  }

  set(element, o) {
    checkElement.call(this, element, o);

    var cbO = {
      cb: this.run.bind(this),
    };

    this.delay = new Delay({ delay: 0, o: cbO });
    this.ease = Ease["l"];

    this.props = o.p;
    this.keys = Object.keys(o.p);

    checkProps.call(this);
    this.play();
  }

  run(t) {
    var e = this.ease(t);
    this.running = true;

    this.results.map((p) => {
      if (this.obj) {
        this.elements[0][p.name] = p.cb(e);
      } else {
        p.element.style[p.name] = p.cb(e);
      }
    });

    if (t === 1) this.running = false;

    return this.stop;
  }

  reverse(v) {
    if (v) {
      for (let i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
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

  kill(ele) {
    if (!ele) {
      this.stop = true;
      return;
    }

    var re = this.store.get(ele);
    if (re) re.kill();
  }

  play() {
    this.delay.play();
    return this;
  }
}

export default Tween;
