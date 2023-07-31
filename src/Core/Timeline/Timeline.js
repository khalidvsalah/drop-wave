import { Tween } from "../../index";

function pT(ele, o, t, obj) {
  let pr = this.its[this.id - 1];
  let prl = pr ? (pr.late || 0) + pr.d : 0;
  let late = (o.late || 0) + prl + t;
  let tween = Tween(ele, { ...o, late }, obj);

  if (this.id == 0) this.fl = o.late;
  this.its.push({ tween, late, d: o.d, t });
}

class TL {
  constructor() {
    this.its = [];
    this.id = -1;
    this.fl = 0;
  }

  to(ele, o, t = 0) {
    if (!ele || !o) return;

    ++this.id;
    pT.call(this, ele, o, t);
    return this;
  }

  reverse() {
    this.id = -1;

    let l = this.its.length - 1;
    this.its.map(({ tween, t }, i) => {
      tween.reverse(this.its[l - i].late - this.fl - t);
    });

    this.its = [];
  }
}

export default TL;
