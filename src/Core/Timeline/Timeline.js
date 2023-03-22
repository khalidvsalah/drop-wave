import Tween from "./tools/createTween";

class TL {
  constructor() {
    this.items = [];
    this.store = new Map();
  }

  to(element, o, time = 0) {
    this.selector = [];

    if (!element || !o) {
      var err = !element
        ? "You need to pass Element"
        : "You need to pass Object";

      console.error(err);
      return;
    }

    Tween.call(this, element, o, time);
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
