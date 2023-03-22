import A from "../../../../index.js";
import { Ease } from "../../../Math/Math.js";
import checkProps from "../props/checkProps";

export default class T {
  constructor(element, o, w) {
    this.elements = element;

    this.stop = false;
    this.o = o;
    if (w) {
      this.wTo();
    } else {
      this.to();
    }
  }

  to() {
    this.d = this.o.d ? this.o.d : 500;
    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
      completed: this.o.completed,
    };

    this.del = this.o.delay ? this.o.delay : 0;
    this.delay = new A.Delay({ delay: this.del, o: this.cbO });
    this.ease = this.o.ease ? Ease[this.o.ease] : Ease["l"];

    this.props = this.o.p;
    this.keys = Object.keys(this.props);
    checkProps.call(this, this.w);
  }

  wTo() {
    this.w = true;
    this.to();
  }

  set(element, o) {
    checkElement.call(this, element, o);

    var cbO = {
      cb: this.run.bind(this),
    };

    this.delay = new A.Delay({ delay: 0, o: cbO });
    this.ease = Ease["l"];

    this.props = o.p;
    this.keys = Object.keys(o.p);

    checkProps.call(this);
    this.play();
  }

  run(t) {
    var e = this.ease(t);
    this.results.map((p) => {
      if (this.w) {
        this.elements[0][p.name] = p.cb(e);
        console.log(this.elements[0], p.name);
      } else {
        p.element.style[p.name] = p.cb(e);
      }
    });

    return this.stop;
  }

  play() {
    this.delay.play();
  }
}
