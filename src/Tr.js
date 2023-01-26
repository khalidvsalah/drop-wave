import A from "../index.js";
import props from "./props/props.js";

function checkElement(element, o) {
  if (!element || !o) return;
  if (typeof element === "string") {
    var els = document.querySelectorAll(element);
    if (els.length === 0) {
      console.error("Found no element");
    } else {
      this.selector = new Array(...els);
    }
  } else if (element instanceof window.HTMLElement) {
    this.selector.push(element);
  }
}

class Tr {
  constructor() {
    this.selector = [];
    this.tl = [];
  }

  to(element, o) {
    checkElement.call(this, element, o);

    var ob = {
      cb: this.run.bind(this),
      d: o.d ? o.d : 500,
    };

    var del = o.delay ? o.delay : 0;
    this.delay = new A.Delay({ delay: del, o: ob });
    this.ease = o.ease ? A.Ease[o.ease] : A.Ease["l"];

    this.ph = o.p;
    this.keys = Object.keys(o.p);
    this.ps = [];

    this.toward();
  }

  toward() {
    this.pRe = [];

    if (A.Has(this.ph, "x") || A.Has(this.ph, "y")) {
      var x = A.Has(this.ph, "x") && this.ph["x"];
      var y = A.Has(this.ph, "y") && this.ph["y"];
      this.pRe.push({ name: "transform", cb: props["transform"](x, y) });
    }

    if (A.Has(this.ph, "opacity")) {
      var o = this.ph["opacity"];
      this.pRe.push({ name: "opacity", cb: props["opacity"](o) });
    }
  }

  run(t) {
    var e = this.ease(t);

    this.pRe.map((p) => {
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
