import Tween from "./Tween/Tween.js";

function pushTween(obj) {
  this.selector.map(({ element, o, time = 0 }, i, arr) => {
    if (i === 0) {
      let tween = Tween(element, o, obj);
      this.items.push({ tween, o });
    } else {
      let delay, duration, stagger, add;

      stagger = arr[i - 1].o.stagger || 0;
      duration = arr[i - 1].o.d || 0;
      delay = arr[i - 1].o.delay || 0;
      add = delay + stagger + duration + (o.delay || 0) + time;

      let o2 = { ...o, delay: add };
      let tween = Tween(element, o2, obj);
      this.items.push({ tween, o: o2 });
    }
  });
}

function createTween(element, o, time) {
  var obj = false;

  if (
    typeof element === "object" &&
    !element.length &&
    !(element instanceof HTMLElement)
  ) {
    obj = true;
    this.selector.push({ element, o, time });
  } else {
    obj = false;
    if (element.length) {
      const array = [...element];
      array.map((ele) => {
        this.selector.push({ element: ele, o, time });
      });
    } else {
      this.selector.push({ element, o, time });
    }
  }

  pushTween.call(this, obj);
}

export default createTween;
