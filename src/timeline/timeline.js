import T from "./T.js";
import checkElement from "./utils/Element.js";

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

function initTL(element, o, time, w) {
  this.element = element;
  this.o = o;
  this.time = time;
  checkElement.call(this, this.element);
  push.call(this, w);

  this.store.set(element, this.items[this.items.length - 1]);
}

class TL {
  constructor() {
    this.items = [];
    this.store = new Map();
  }

  to(element, o, time = 0) {
    this.selector = [];

    if (!element || !o) {
      console.error(
        !element ? "You need to pass Element" : "You need to pass Object"
      );
      return;
    }

    if (typeof element === "object" && !Array.isArray(element)) {
      initTL.call(this, element, o, time, true);
    } else {
      initTL.call(this, element, o, time, false);
    }
  }

  kill(s) {
    if (!s) {
      console.error("enter vailed element");
    } else {
      var ei = this.store.get(s);
      if (ei) {
        ei.stop = true;
      }
    }
  }

  play() {
    this.items.map((t) => {
      t.play();
    });

    this.items = [];
    this.selector = [];
  }
}

export default TL;
