import { states } from '../../states/states';

class Visiability {
  init(raf) {
    window.onvisibilitychange = states.create('visibilitychange').notify;

    if (!this.raf) {
      states.subscribe('visibilitychange', this.change.bind(this));
      this.raf = raf;
    }
  }

  change() {
    const now = performance.now();
    if (document.hidden) {
      this.hide = now;
    } else {
      this.raf.items.map(item => {
        item.st += now - this.hide;
      });
    }
  }
}

export default new Visiability();
