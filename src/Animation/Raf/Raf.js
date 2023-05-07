import { Clamp } from "../../index";

class _F {
  constructor() {
    this.items = [];
    this.on = false;
    this.id = -1;
  }

  push(o) {
    if (typeof o.id === "number") this.kill(o.id);

    if (typeof o === "object") {
      let item = o;

      item.id = ++this.id;
      this.items.push(item);

      if (item.d === 0) {
        item.completed && item.completed();
      }

      !this.on && this.loop();
      return item.id;
    } else {
      console.error("Failed To Push Object");
    }
  }

  update(t) {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      if (!item.st && item.d !== -1) {
        item.st = t;
        if (item.start) item.start();
      }

      if (item.pause) {
        item.elapsed = item.elapsed ? 1 - item.elapsed : 1;
        item.d = !item.paused ? item.elapsed * item.d : item.d;
        item.st = t - item.d * item.elapsed;
        item.paused = true;
      } else if (item.d === -1) {
        item.cb(t);
      } else if (item.d > 0) {
        let time = (t - item.st) / (item.d * 1000);

        item.elapsed = Clamp(0, 1, time);
        if (item.cb) item.cb(item.elapsed);

        if (item.elapsed === 1) this.kill(item.id, "elapsed");
      }
    }

    this.loop();
  }

  kill(n, me) {
    if (typeof n === "number") {
      this.items.map((item, i) => {
        if (item.id === n) {
          if (item.cb) item.cb(item.elapsed);
          if (item.completed) item.completed();

          item.st = 0;
          item.id = null;

          this.items.splice(i, 1);
        }
      });
    } else {
      console.error("You Need To Pass Number", me);
    }
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
