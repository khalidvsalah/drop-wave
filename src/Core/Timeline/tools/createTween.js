import Tween from "./Tween/Tween.js";

function pushTween(element, o, time, obj) {
  let duration = this.items[this.id - 1];
  this.del += o.delay + time + (duration ? duration.o.d : 0);

  if (element.length) {
    let tweens = Tween(element, o, obj);
    tweens.map((tween) => {
      this.items.push({ tween, o, origin: o, time });
    });
  } else {
    if (this.id === 0) {
      let tween = Tween(element, o, obj);
      this.items.push({ tween, o, origin: o, time });
    } else {
      let delay = { ...o, delay: this.del };
      let tween = Tween(element, delay, obj);

      this.items.push({ tween, o: delay, origin: o, time });
    }
  }
}

function createTween(element, o, time) {
  ++this.id;

  if (
    typeof element === "object" &&
    !element.length &&
    !(element instanceof HTMLElement)
  ) {
    pushTween.call(this, element, o, time, true);
  } else {
    pushTween.call(this, element, o, time, false);
  }
}

export default createTween;
