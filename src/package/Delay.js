import _F from "./Frame.js";

export default class Delay {
  constructor({ delay, cb }) {
    this.delay = delay;
    this.cb = cb;
    this.index = _F.push({ completed: cb, d: delay });
  }

  kill() {
    _F.kill(this.index);
    _F.push({ completed: this.cb, d: 0 });
  }
}
