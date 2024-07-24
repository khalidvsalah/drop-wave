export class choke {
  #time = 0;

  /**
   * @param {{d: Number, cb: Function}}
   */
  constructor({ d, cb }) {
    this.d = d * 1000;
    this.cb = cb;
  }

  run() {
    clearTimeout(this.#time);
    this.#time = setTimeout(this.cb, this.d);
  }
}
