import Ardor from "../index.js";

export default class Delay {
  constructor({ delay, cb }) {
    this.delay = delay;
    this.cb = cb;
  }

  kill() {
    Ardor._F.kill(this.index);
    Ardor._F.push({ completed: this.cb, d: 0 });
  }

  play() {
    this.index = Ardor._F.push({ completed: this.cb, d: this.delay });
    if (!Ardor._F.on) {
      Ardor._F.play();
    }
  }

  remove() {
    Ardor._F.kill(this.index);
  }
}
