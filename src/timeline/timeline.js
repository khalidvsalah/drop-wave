import T from "./T.js";
import checkElement from "./Element.js";

function push(w) {
  var prevTime =
    this.items.length &&
    this.items[this.items.length - 1].d + this.items[this.items.length - 1].del;
  var curTime = this.o.delay + this.time;

  this.selector.map((ele) => {
    this.items.push(
      new T(
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

class TL {
  constructor() {
    this.items = [];
    this.selector = [];
  }

  to(element, o, time = 0) {
    if (!element || !o) {
      console.error(
        !element ? "You need to pass Element" : "You need to pass Object"
      );
      return;
    }
    this.element = element;
    this.o = o;
    this.time = time;
    checkElement.call(this, this.element);
    push.call(this);
  }

  wTo(element, o, time = 0) {
    this.element = element;
    this.o = o;
    this.time = time;
    checkElement.call(this, this.element);
    push.call(this, true);
  }

  play() {
    this.items.map((t) => {
      t.play();
    });
  }
}

export default TL;
