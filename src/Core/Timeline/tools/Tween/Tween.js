import Delay from "../../../../Animation/Delay/delay.js";
import { Ease } from "../../../Math/math.js";
import checkProps from "../props/checkProps";

export default class Tween {
  constructor(element, o, obj = false) {
    this.elements = element;

    this.stop = false;
    this.o = o;
    this.obj = obj;

    if (obj) {
      this.wTo();
    } else {
      this.to();
    }
  }

  to() {
    this.d = this.o.d ? this.o.d : 500;
    this.cbO = {
      cb: this.run.bind(this),
      d: this.d * 1000,
      completed: this.o.completed,
    };

    this.del = this.o.delay ? this.o.delay : 0;
    this.delay = new Delay({ delay: this.del * 1000, o: this.cbO });
    this.ease = this.o.ease ? Ease[this.o.ease] : Ease["l"];

    this.props = this.o.p;
    this.keys = Object.keys(this.props);
    checkProps.call(this, this.obj);
  }

  wTo() {
    this.obj = true;
    this.to();
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

    this.results.map((p) => {
      if (this.obj) {
        this.elements[0][p.name] = p.cb(e);
      } else {
        p.element.style[p.name] = p.cb(e);
      }
    });

    return this.stop;
  }

  pause() {
    this.delay.o.pause = true;
  }

  resume() {
    this.delay.o.pause = false;
  }

  play() {
    this.delay.play();
  }
}

/*
  ! Fix timline class ( mark called tween); 
*/
