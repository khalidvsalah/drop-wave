import { clamp } from '../math/math';
import { observer } from './Observer';

class Raf {
  #id = -1;
  #items = [];
  #hiddenFor = 0;

  constructor() {
    document.onvisibilitychange = observer.create('visibilitychange').notify;
    observer.subscribe('visibilitychange', this.#change.bind(this));
  }

  /**
   * Push Objects.
   * @param {{cb: Function, d: number}} o
   * @returns {Number} - object id.
   */
  push(o) {
    o.id = ++this.#id;
    this.#items.push(o);
    if (!this.on) this.#loop();
    return o.id;
  }

  #update(t) {
    for (let i = 0; i < this.#items.length; i++) {
      const o = this.#items[i];

      if (o.d) {
        if (!o.st) o.st = t;
        const time = (t - o.st) / (o.d * 1e3);
        const elapsed = clamp(0, 1, time);
        o.cb(elapsed);

        if (elapsed === 1) this.kill(o.id);
      } else o.cb(t);
    }

    this.#loop();
  }

  /**
   * Remove object from items.
   * @param {Number} - object id.
   */
  kill(n) {
    this.#items.map((o, i) => {
      if (o.id === n) {
        o.id = null;
        o.st = null;
        this.#items.splice(i, 1);
      }
    });
  }

  #loop() {
    if (this.#items.length === 0) {
      window.cancelAnimationFrame(this.raf);
      this.on = false;
    } else {
      this.raf = window.requestAnimationFrame(this.#update.bind(this));
      this.on = true;
    }
  }

  #change() {
    const now = performance.now();
    if (document.hidden) this.#hiddenFor = now;
    else this.#items.map((item) => (item.st += now - this.#hiddenFor));
  }
}

export const raf = new Raf();
