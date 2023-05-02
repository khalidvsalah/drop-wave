import Tween from "./Tween/Tween.js";

function pushTween(obj) {
  let pD, pDel;

  if (this.items.length) {
    pD = this.items[this.items.length - 1].tween.d;
    pDel = this.items[this.items.length - 1].tween.del;
  }

  let pT = pD + pDel + (this.o.delay ? this.o.delay : 0);
  let cT = this.o.delay ? this.o.delay : 0;

  let o = { ...this.o, delay: (pT ? pT : cT) + +this.time };

  this.selector.map((ele, i) => {
    let tween = new Tween();

    if (i === 0) {
      this.items.push({ tween: tween.to(ele, o, obj), called: false });
    } else {
      let prevS = this.items[i - 1].tween.o.stagger;
      let pS = prevS ? prevS : 0;
      o.stagger = o.stagger + pS;

      this.items.push({
        tween: tween.to(ele, { ...o, delay: o.delay + pS }, obj),
        called: false,
      });
    }
  });
}

function createTween(element, o, time) {
  var obj = false;

  if (
    typeof element === "object" &&
    !Array.isArray(element) &&
    !(element instanceof HTMLElement)
  ) {
    obj = true;
    this.selector.push(element);
  } else {
    obj = false;
    if (Array.isArray(element)) {
      this.selector.push(...element);
    } else {
      this.selector.push(element);
    }
  }

  this.element = element;
  this.o = o;
  this.time = time;

  pushTween.call(this, obj);
}

export default createTween;
