import { Tween } from "../../index";

function pushTween(ele, o, time, obj) {
  let prev = this.items[this.id - 1];
  this.late = (o.late || 0) + (prev ? (prev.late || 0) + prev.d : 0) + time;

  let tween = Tween(ele, { ...o, late: this.late }, obj);

  this.items.push({
    tween,
    late: this.late,
    addlate: this.late - (o.late || 0),
    d: o.d,
  });
}

class TL {
  constructor() {
    this.items = [];
    this.id = -1;
    this.late = 0;
  }

  to(ele, o, time = 0) {
    if (!ele || !o) return;

    ++this.id;
    pushTween.call(this, ele, o, time);
    return this;
  }

  pause() {
    this.items.map(({ tween }) => tween.pause());
  }

  resume() {
    this.items.map(({ tween }) => tween.resume());
  }

  reverse() {
    this.id = -1;

    this.items.map(({ tween, addlate }) => {
      tween.reverse(this.late - addlate);
    });

    this.items = [];
    this.late = 0;
  }
}

export default TL;
