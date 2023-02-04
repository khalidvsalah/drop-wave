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

    this.store.set(ele, this.items[this.items.length - 1]);
  });
}

function initTL(element, o, time, w) {
  this.element = element;
  this.o = o;
  this.time = time;
  checkElement.call(this, this.element);
  push.call(this, w);
}

class TL {
  constructor() {
    this.items = [];
    this.selector = [];
    this.store = new WeakMap();
  }

  init(element, o, time, w) {
    this.element = element;
    this.o = o;
    this.time = time;
    checkElement.call(this, this.element);
    push.call(this, w);
  }

  to(element, o, time = 0) {
    if (!element || !o) {
      console.error(
        !element ? "You need to pass Element" : "You need to pass Object"
      );
      return;
    }
    initTL.call(this, element, o, time, false);
  }

  wTo(element, o, time = 0) {
    initTL.call(this, element, o, time, true);
  }

  kill(element) {
    var es = [...document.querySelectorAll(element)];
    es.map((e) => {
      var er = this.store.get(e);
      if (er) {
        er.stop = true;
      }
    });
  }

  play() {
    this.items.map((t) => {
      t.play();
    });
  }
}

export default TL;
