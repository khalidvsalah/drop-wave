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
        if (this.items[i].d) {
          this.elapsed = (t - this.items[i].st) / this.items[i].d;

          if (this.elapsed >= 1) {
            this.items[i].cb(this.elapsed);
            if (this.items[i].completed) {
              this.items[i].completed();
            }
            this.items.splice(i, 1);
          } else {
            this.items[i].cb(this.elapsed);
          }
        } else {
          this.items[i].cb(t);
        }
      }
    }

    this.play();
  }

  kill(index) {
    this.items[index].cb(this.elapsed);
    this.items.splice(index, 1);
  }

  play() {
    if (this.items.length === !1) return;
    window.requestAnimationFrame(this.update.bind(this));
  }
}

export default new _F();
