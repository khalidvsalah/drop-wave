import A from "../../index.js";
import checkElement from "./Element.js";
import checkProps from "./checkProps.js";

export default class T {
  constructor(element, o) {
    this.element = element;
    this.o = o;
    this.selector = [];
    this.to();
  }

  to() {
    if (!checkElement.call(this, this.element, this.o)) return;

    this.d = this.o.d ? this.o.d : 500;
    this.cbO = {
      cb: this.run.bind(this),
      d: this.d,
    };

    this.del = this.o.delay ? this.o.delay : 0;
    this.delay = new A.Delay({ delay: this.del, o: this.cbO });
    this.ease = this.o.ease ? A.Ease[this.o.ease] : A.Ease["l"];

    this.props = this.o.p;
    this.keys = Object.keys(this.props);

    checkProps.call(this);
  }

  set(element, o) {
    checkElement.call(this, element, o);

    var cbO = {
      cb: this.run.bind(this),
    };

    this.delay = new A.Delay({ delay: 0, o: cbO });
    this.ease = A.Ease["l"];

    this.props = o.p;
    this.keys = Object.keys(o.p);

    checkProps.call(this);
    this.play();
  }

  run(t) {
    var e = this.ease(t);

    this.results.map((p) => {
      this.selector.map((s) => {
        s.style[p.name] = p.cb(e);
      });
    });
  }

  play() {
    this.delay.play();
  }
}
