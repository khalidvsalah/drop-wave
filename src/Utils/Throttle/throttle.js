export default class Throttle {
  constructor({ delay, cb }) {
    this.delay = delay * 1000;
    this.cb = cb;
    this.time = 0;
  }

  run() {
    clearTimeout(this.time);
    this.time = setTimeout(this.cb, this.delay);
  }
}
