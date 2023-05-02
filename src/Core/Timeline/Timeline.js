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
    this.items.map((t) => {
      t.tween.pause();
    });
  }

  resume() {
    this.items.map((t) => {
      t.tween.resume();
    });
  }

  reverse() {
    this.itemsReverse.reverse().map((t) => {
      t.tween.reverse();
    });
  }

  kill() {}

  play() {
    this.items.map((t) => {
      if (!t.called) {
        t.tween.play();
        t.tween.called = true;
      }
    });

    this.selector = [];
    this.itemsReverse = this.items;
    this.items = [];
  }
}

export default TL;
