import createTween from "./tools/createTween";

class TL {
  constructor() {
    this.items = [];
    this.reverseItems = [];

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
    this.items.reverse().map((tw) => {
      if (!tw.reverse) {
        tw.tween.reverse();
        tw.reverse = true;
      }
    });

    this.items = [];
  }
}

export default TL;
