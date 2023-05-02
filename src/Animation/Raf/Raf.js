import { Clamp } from "../../index";

class _F {
  constructor() {
    this.items = [];
    this.on = false;
  }

  push(o) {
    if (Array.isArray(o)) {
      return o.map((obj) => {
        this.items.push(obj);
        return this.items.length - 1;
      });
    } else if (typeof o === "object") {
      this.items.push(o);
      return this.items.length - 1;
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

      if (item.d === 0) {
        item.completed && item.completed();
        this.items.splice(i, 1);
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

        if (item.cb) {
          let rm = item.cb(item.elapsed);
          rm && (item.elapsed = 1);
        }

        if (item.elapsed === 1) {
          if (item.completed) item.completed();
          this.items.splice(i, 1);
        }
      }
    }

    this.loop();
  }

  kill(n) {
    if (Array.isArray(n)) {
      n.map((i) => {
        if (this.items[i].cb) {
          this.items[i].cb(this.elapsed);
        }
        this.items.splice(i, 1);
      });
    } else if (typeof n === "number") {
      if (this.items[n].cb) {
        this.items[n].cb(this.elapsed);
      }
      this.items.splice(n, 1);
    } else {
      console.error("You Need To Pass Array or Number");
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

  play() {
    if (!this.on) {
      this.loop();
    }
  }
}

export default new _F();
