import Ardor from "../../index.js";

export default class Delay {
  constructor({ delay, o }) {
    this.delay = delay;
    this.o = o;
    this.played = false;
  }

  // kill() {
  //   if (!this.played) {
  //     console.warn("You need to play it before kill it.");
  //     return;
  //   }
  //   Ardor.Raf.kill(this.index);
  //   this.elapsed();
  // }

  play() {
    this.played = true;
    this.index = Ardor.Raf.push({
      completed: this.elapsed.bind(this),
      d: this.delay,
    });
    if (!Ardor.Raf.on) {
      Ardor.Raf.play();
    }
  }

  elapsed() {
    Ardor.Raf.push(this.o);

    if (!Ardor.Raf.on) {
      Ardor.Raf.play();
    }
  }

  remove() {
    Ardor.Raf.kill(this.index);
  }
}
