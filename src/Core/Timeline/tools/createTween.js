import Tween from "./Tween/Tween.js";
import checkElement from "./elements/checkEle";

function pushTween(w) {
  var prevTime =
    this.items.length &&
    this.items[this.items.length - 1].d + this.items[this.items.length - 1].del;
  var curTime = this.o.delay + this.time;

  this.selector.map((ele) => {
    this.items.push(
      new Tween(
        ele,
        {
          ...this.o,
          delay: prevTime ? prevTime : curTime,
        },
        w
      )
    );
  });
}

function createTween(element, o, time) {
  var webgl = false;

  if (element instanceof HTMLElement) {
    webgl = false;
  } else if (Array.isArray(element)) {
    element.map(() => {
      if (element instanceof HTMLElement) {
        webgl = false;
      } else {
        webgl = true;
      }
    });
  } else {
    webgl = true;
  }

  this.element = element;
  this.o = o;
  this.time = time;

  checkElement.call(this, this.element);
  pushTween.call(this, webgl);

  this.store.set(element, this.items[this.items.length - 1]);
}

export default createTween;
