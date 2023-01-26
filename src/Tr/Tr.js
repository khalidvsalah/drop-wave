import A from "../../index.js";
import checkElement from "./Element.js";
import checkProps from "./checkProps.js";

class Tr {
  constructor() {
    this.selector = [];
    this.tl = [];
  }

  to(element, o) {
    if (!checkElement.call(this, element, o)) return;

    var cbO = {
      cb: this.run.bind(this),
      d: o.d ? o.d : 500,
    };

    var del = o.delay ? o.delay : 0;
    this.delay = new A.Delay({ delay: del, o: cbO });
    this.ease = o.ease ? A.Ease[o.ease] : A.Ease["l"];

    this.props = o.p;
    this.keys = Object.keys(o.p);

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

export default Tr;
