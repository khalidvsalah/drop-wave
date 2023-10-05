import { Tween, Bounds, Sub, Remap, Props } from "../../index";

class Trigger {
  constructor(el, o, sub, dir) {
    this.sub = sub;
    this.id = Sub.add(sub, this.raf.bind(this));
    this.iresize = Sub.add("resize", this.resize.bind(this));

    this.o = o;
    this.el = el;

    this.dir = dir;
    this.d = dir ? "y" : "x";

    if (o.t) this.ps = Props(o.t, false, o.o.p);

    this.resize();
  }

  raf(e) {
    if (this.ps) {
      let p = (typeof this.o.s == "number" ? this.o.s : 0.2) * this.l;
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
    Tween(this.o.t || this.el, this.o.o);
    this.o.cb && this.o.cb();
    this.id.r();
  }

  scroll(t) {
    if (!this.in) return;
    this.o.raf && this.o.raf(t);
    this.ps.map((p) => (this.o.t.style[p.name] = p.cb(t)));
  }

  resize() {
    this.b = Bounds(this.el);

    if (this.dir) {
      this.p = this.b.t;
      this.si = this.b.b;
    } else {
      this.p = this.b.l;
      this.si = this.b.r;
    }

    this.l = this.dir ? window.innerHeight : window.innerWidth;
  }
}

export default Trigger;
