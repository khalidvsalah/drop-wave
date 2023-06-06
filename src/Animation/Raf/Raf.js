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

      !this.on && this.loop();
      return item.id;
    } else {
      console.error("Failed To Push Object");
    }
  }

  update(t) {
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      if (item.cb) {
        const cb = item.cb(t);
        cb && this.kill(item.id);
      }
    }

    this.loop();
  }

  kill(n) {
    if (typeof n === "number") {
      this.items.map((item, i) => {
        if (item.id === n) {
          item.id = null;
          this.items.splice(i, 1);
        }
      });
    } else {
      console.error("You Need To Pass Number");
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
