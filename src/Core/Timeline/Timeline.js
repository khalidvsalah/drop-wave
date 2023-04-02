import createTween from "./tools/createTween";

class TL {
  constructor() {
    this.items = [];
    this.store = new Map();
    this.played = false;
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

    createTween.call(this, element, o, time);
    return this;
  }

  pause() {
    if (!this.played) return;
    this.items.map((t) => {
      t.tween.pause();
    });
  }

  resume() {
    this.items.map((t) => {
      t.tween.resume();
    });
  }

  kill(s) {
    if (!s) {
      console.error("enter vailed element");
    } else {
      var ei = this.store.get(s);
      if (ei) {
        ei.kill();
      }
    }
  }

  play() {
    this.played = true;
    this.items.map((t) => {
      if (!t.called) {
        t.tween.play();
        t.tween.called = true;
      }
    });
    this.selector = [];
  }
}

export default TL;
