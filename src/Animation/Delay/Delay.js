import { Raf } from "../../index";

export default class Delay {
  constructor({ delay, o, elapsed }) {
    this.delay = delay;
    this.o = o;
    this.elapsed = elapsed;
  }

  play() {
    this.index = Raf.push({
      completed: this.Elapsed.bind(this),
      d: this.delay,
    });

    this.elapsed && this.elapsed();
    Raf.play();
  }

  Elapsed() {
    this.o && Raf.push(this.o);
    Raf.play();
  }

  remove() {
    Raf.kill(this.index);
  }
}
