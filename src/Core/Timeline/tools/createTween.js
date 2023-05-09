import Tween from "./Tween/Tween.js";

function pushTween(element, o, time, obj) {
  if (element.length) {
    [...element].map((ele, k) => {
      if (k === 0) {
        let tween = Tween(ele, o, obj);
        this.items.push({ tween, o });
      } else {
        let delay = o.delay || 0;
        let add = delay + (o.stagger || 0) * k;

        let tween = Tween(ele, { ...o, delay: add }, obj);

        this.items.push({ tween, o });
      }
    });
  } else {
    if (this.id === 0) {
      let tween = Tween(element, o, obj);
      this.items.push({ tween, o });
    } else {
      let delay, duration, add;

      duration = this.items[this.id - 1].o.d || 0;
      delay = this.items[this.id - 1].o.delay || 0;
      add = delay + duration + (o.delay || 0) + time;

      let copy = { ...o, delay: add };
      let tween = Tween(element, copy, obj);

      this.items.push({ tween, o: copy });
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
