import { Raf } from "../../index";

export default class Delay {
  constructor({ delay, o, elapsed }) {
    this.delay = delay;
    this.o = o;
    this.id;
    this.elapsed = elapsed;
  }

  play() {
    this.remove();

    this.index = Raf.push({
      completed: this.Elapsed.bind(this),
      d: this.delay,
    });

    this.elapsed && this.elapsed();
  }

  Elapsed() {
    this.o && (this.id = Raf.push(this.o));
  }

  remove() {
    if (this.id) Raf.kill(this.index);
  }
}
