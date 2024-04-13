export default class Choke {
  #time = 0;

  constructor({ d, cb }) {
    this.d = d * 1000;
    this.cb = cb;
  }

  run() {
    clearTimeout(this.#time);
    this.#time = setTimeout(this.cb, this.d);
  }
}
