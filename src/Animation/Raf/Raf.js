import { Clamp } from "../../index";

class _F {
  constructor() {
    this.items = [];
    this.on = false;

    this.id = -1;
  }

  push(o) {
    if (o.d == 0) return o.cb(1), undefined;

    o.id = ++this.id;

    this.items.push(o);
    if (!this.on) this.loop();

    return o.id;
  }

  update(t) {
    for (let i = 0; i < this.items.length; i++) {
      let o = this.items[i];

      if (o.d) {
        if (!o.st) o.st = t;
        let time = (t - o.st) / (o.d * 1e3);

        let e = Clamp(0, 1, time);
        let cb = o.cb(e);

        if (cb || e == 1) this.kill(o.id);
      } else o.cb(t);
    }

    this.loop();
  }

  kill(n) {
    this.items.map((o, i) => {
      if (o.id === n) {
        o.id = null;
        o.st = null;
        this.items.splice(i, 1);
      }
    });
  }

  loop() {
    if (this.items.length === 0) {
      this.on = false;
      window.cancelAnimationFrame(this.raf);
    } else {
      this.on = true;
      this.raf = window.requestAnimationFrame(this.update.bind(this));
    }
  }
}

export default new _F();
