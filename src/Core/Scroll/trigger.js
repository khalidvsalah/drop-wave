import { Tween, Bounds, Sub, Remap, Props } from "../../index";

class Trigger {
  constructor(el, o, sub, dir) {
    this.id = Sub.add(sub, this.raf.bind(this));
    this.iresize = Sub.add("resize", this.resize.bind(this));

    this.o = o;
    this.el = el;
    this.sub = sub;

    this.dir = dir;
    this.d = dir ? "y" : "x";

    this.ti = this.o.trigger;

    this.tResults = Props(o.t, false, this.ti.p);
    this.resize();
  }

  raf(e) {
    if (this.ti) {
      let p = (this.ti.s || 0.2) * this.l;
      let d = e[this.d] + this.l;

      let start = this.p - p;
      let end = this.si + p + this.l;

      this.scroll(Remap(start, end, d));

      if (start <= d) this.in = true;
      if (end <= d) this.in = false;
    } else {
      let d = e[this.d] + this.l;
      let p = ((this.o.s || 0) / 100) * this.l;
      if (p + this.p <= d) this.fire();
    }
  }

  fire() {
    Tween(this.o.t, this.o.o);
    this.o.cb && this.o.cb();
    this.id.r();
  }

  scroll(t) {
    if (!this.in) return;

    this.tResults.map((p) => (this.o.t.style[p.name] = p.cb(t)));
  }

  resize() {
    this.b = Bounds(this.el);

    if (this.dir) {
      this.p = this.b.top;
      this.si = this.b.bottom;
    } else {
      this.p = this.b.left;
      this.si = this.b.right;
    }

    this.l = this.dir ? window.innerHeight : window.innerWidth;
  }
}

export default Trigger;
