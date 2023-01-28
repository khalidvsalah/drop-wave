import T from "./T.js";
import checkElement from "./Element.js";

function push() {
  var prevTime =
    this.items.length &&
    this.items[this.items.length - 1].d + this.items[this.items.length - 1].del;
  var curTime = this.o.delay + this.time;

  checkElement.call(this, this.element);

  this.selector.map((ele) => {
    this.items.push(
      new T(ele, {
        ...this.o,
        delay: prevTime ? prevTime : curTime,
      })
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

    push.call(this);
  }

  play() {
    this.items.map((t) => {
      t.play();
    });
  }
}

export default TL;
