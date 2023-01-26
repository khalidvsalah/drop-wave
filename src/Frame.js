import Ardor from "../index.js";
class _F {
  constructor() {
    this.items = [];
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
      if (!this.items[i].st) {
        this.items[i].st = t;
        if (this.items[i].start) {
          this.items[i].start();
        }
      } else {
        if (this.items[i].d || typeof this.items[i].d === "number") {
          this.elapsed = Ardor.Clamp(
            0,
            1,
            (t - this.items[i].st) / this.items[i].d
          );

          if (this.items[i].cb) {
            this.items[i].cb(this.elapsed);
          }

          if (this.elapsed >= 1) {
            if (this.items[i].completed) {
              this.items[i].completed();
            }
            this.items.splice(i, 1);
          }
        } else if (this.items[i].d === -1) {
          this.items[i].cb(t);
        } else {
          this.items[i].cb(1);
          this.items.splice(i, 1);
        }
      }
    }

    this.play();
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

  play() {
    if (this.items.length === !1) {
      this.on = false;
      return;
    }
    this.on = true;
    window.requestAnimationFrame(this.update.bind(this));
  }
}

export default new _F();
