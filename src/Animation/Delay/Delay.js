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

    if (!Raf.on) Raf.play();
  }

  elapsed() {
    Raf.push(this.o);

    if (!Raf.on) Raf.play();
  }

  remove() {
    Raf.kill(this.index);
  }
}
