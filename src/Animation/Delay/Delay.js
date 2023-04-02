import { Raf } from "../../index";

export default class Delay {
  constructor({ delay, o }) {
    this.delay = delay;
    this.o = o;
    this.played = false;
  }

  play() {
    this.played = true;
    this.index = Raf.push({
      completed: this.elapsed.bind(this),
      d: this.delay,
    });

    Raf.play();
  }

  elapsed() {
    Raf.push(this.o);

    Raf.play();
  }

  remove() {
    Raf.kill(this.index);
  }
}
