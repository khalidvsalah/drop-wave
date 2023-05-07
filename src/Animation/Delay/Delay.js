import { Raf } from "../../index";

export default class Delay {
  constructor({ delay, o, elapsed }) {
    this.delay = delay;
    this.o = o;
    this.id;
    this.elapsed = elapsed;
  }

  play() {
    this.index = Raf.push({
      completed: this.Elapsed.bind(this),
      d: this.delay,
    });
  }

  Elapsed() {
    this.elapsed && this.elapsed();
    this.o && (this.id = Raf.push(this.o));
  }
}
