import Tween from "./Tween/Tween.js";
import checkElement from "./elements/checkEle";

function pushTween(obj) {
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
        obj
      )
    );
  });
}

function createTween(element, o, time) {
  var obj = false;

  if (typeof element === "object" && !Array.isArray(element)) {
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
