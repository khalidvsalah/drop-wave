import Tween from "./Tween/Tween.js";

function pushTween(element, o, time, obj) {
  let duration = this.items[this.id - 1];
  this.del += o.delay + time + (duration ? duration.o.d : 0);

  if (element.length) {
    [...element].map((ele, k) => {
      if (k === 0) {
        let tween = Tween(ele, o, obj);
        this.items.push({ tween, o });
      } else {
        let delay = o.delay || 0;
        let add = delay + (o.stagger || 0) * k;

        let tween = Tween(ele, { ...o, delay: add }, obj);

        this.items.push({ tween, o, origin: o, time });
      }
    });
  } else {
    if (this.id === 0) {
      let tween = Tween(element, o, obj);
      this.items.push({ tween, o, origin: o, time });
    } else {
      let dela = { ...o, delay: this.del };
      let tween = Tween(element, dela, obj);

      this.items.push({ tween, o: dela, origin: o, time });
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
