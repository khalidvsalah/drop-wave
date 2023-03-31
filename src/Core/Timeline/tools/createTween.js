import Tween from "./Tween/Tween.js";
import checkElement from "./elements/checkEle";

function pushTween(obj) {
  var pD = this.items.length && this.items[this.items.length - 1].tween.d;
  var pDel = this.items.length && this.items[this.items.length - 1].tween.del;

  var pT = pD + pDel + (this.o.delay ? this.o.delay : 0);
  var cT = (this.o.delay ? this.o.delay : 0) + this.time;

  var o = { ...this.o, delay: pT ? pT : cT };

  this.selector.map((ele) => {
    this.items.push({ tween: new Tween(ele, o, obj), called: false });
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
