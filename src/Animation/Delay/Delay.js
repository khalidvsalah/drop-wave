import Raf from "../Raf/Raf.js";

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
  //   Raf.kill(this.index);
  //   this.elapsed();
  // }

  play() {
    this.played = true;
    this.index = Raf.push({
      completed: this.elapsed.bind(this),
      d: this.delay,
    });
    if (!Raf.on) {
      Raf.play();
    }
  }

  elapsed() {
    Raf.push(this.o);

    if (!Raf.on) {
      Raf.play();
    }
  }

  remove() {
    Raf.kill(this.index);
  }
}
