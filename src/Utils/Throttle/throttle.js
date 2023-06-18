export default class Throttle {
  constructor({ late, cb }) {
    this.late = late * 1000;
    this.cb = cb;
    this.time = 0;
  }

  run() {
    clearTimeout(this.time);
    this.time = setTimeout(this.cb, this.late);
  }
}
