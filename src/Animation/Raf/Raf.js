import { Clamp } from "../../index";

class _F {
  constructor() {
    this.items = [];
    this.on = false;
    this.id = -1;
  }

  push(o) {
    if (o.d == 0) {
      o.cb(1);
      return;
    }
    if (o.id) this.kill(o.id);

    let item = o;
    item.id = ++this.id;

    this.items.push(item);

    !this.on && this.loop();
    return item.id;
  }

  update(t) {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.d) {
        if (!item.st) item.st = t;

        let time = (t - item.st) / (item.d * 1e3);
        let elp = Clamp(0, 1, time);

        let cb = item.cb(elp);
        if (cb || elp === 1) this.kill(item.id);
      }
    }
    this.loop();
  }

  kill(n) {
    this.items.map((item, i) => {
      if (item.id === n) {
        item.id = null;
        item.st = null;
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
