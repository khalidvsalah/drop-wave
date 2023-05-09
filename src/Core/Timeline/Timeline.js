import createTween from "./tools/createTween";

class TL {
  constructor() {
    this.items = [];
    this.reverseItems = [];
    this.selector = [];
    this.id = -1;

    this.played = false;
  }

  to(element, o, time = 0) {
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
    this.items.map((tw) => {
      tw.tween.pause();
    });
  }

  resume() {
    this.items.map((tw) => {
      tw.tween.resume();
    });
  }

  reverse() {
    this.id = -1;

    this.items.reverse().map((tw) => {
      tw.tween.reverse();
    });

    this.items = [];
  }
}

export default TL;
