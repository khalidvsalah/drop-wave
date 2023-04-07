import { Raf } from "../../index";

export default class Delay {
  constructor({ delay, o, elapsed }) {
    this.delay = delay;
    this.o = o;
    this.played = false;
    this.elapsed = elapsed;
  }

  play() {
    this.played = true;
    this.index = Raf.push({
      completed: this.Elapsed.bind(this),
      d: this.delay,
    });

    Raf.play();
  }

  Elapsed() {
    this.elapsed();
    Raf.push(this.o);
    Raf.play();
  }

  remove() {
    Raf.kill(this.index);
  }
}
