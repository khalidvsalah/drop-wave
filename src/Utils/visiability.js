class Visiability {
  constructor(raf) {
    document.addEventListener('visibilitychange', this.change.bind(this));
    this.raf = raf;
  }

  change() {
    const now = performance.now();
    if (document.hidden) this.hide = now;
    else this.raf.items.map(item => (item.st += now - this.hide));
  }
}

export default Visiability;
