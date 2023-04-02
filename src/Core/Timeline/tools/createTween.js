import Tween from "./Tween/Tween.js";
import checkElement from "./elements/checkEle";

function pushTween(obj) {
  var pD = this.items.length && this.items[this.items.length - 1].tween.d;
  var pDel = this.items.length && this.items[this.items.length - 1].tween.del;

  var pT = pD + pDel + (this.o.delay ? this.o.delay : 0);
  var cT = this.o.delay ? this.o.delay : 0;

  var o = { ...this.o, delay: (pT ? pT : cT) + +this.time };

  this.selector.map((ele) => {
    if (obj) {
      this.items.push({ tween: new Tween.webgl(ele, o), called: false });
    } else {
      this.items.push({ tween: new Tween.to(ele, o), called: false });
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
  } else {
    obj = false;
  }

  this.element = element;
  this.o = o;
  this.time = time;

  checkElement.call(this, this.element);
  pushTween.call(this, obj);

  this.store.set(element, this.items[this.items.length - 1]);
}

export default createTween;
