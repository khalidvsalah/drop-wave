import { Raf } from "../../index";

export default class Delay {
  constructor({ delay, o, elapsed }) {
    this.delay = delay;
    this.o = o;
    this.elapsed = elapsed;
  }

  play() {
    Raf.push({
      completed: this.Elapsed.bind(this),
      d: this.delay,
    });
  }

  Elapsed() {
    this.o && Raf.push(this.o);
    this.elapsed && this.elapsed();
  }
}
