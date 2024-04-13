import observer from '../../../Core/Observer/observer';

class Visiability {
  constructor() {}

  init(raf) {
    if (!this.raf) {
      observer.subscribe('visibilitychange').onChange(this.#change.bind(this));
      this.raf = raf;
    }
  }

  #change() {
    const now = performance.now();
    if (document.hidden) this.hide = now;
    else this.raf.items.map(item => (item.st += now - this.hide));
  }
}

export default new Visiability();
