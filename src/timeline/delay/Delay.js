import Ardor from "../../../index.js";

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
  //   Ardor._F.kill(this.index);
  //   this.elapsed();
  // }

  play() {
    this.played = true;
    this.index = Ardor._F.push({
      completed: this.elapsed.bind(this),
      d: this.delay,
    });
    if (!Ardor._F.on) {
      Ardor._F.play();
    }
  }

  elapsed() {
    Ardor._F.push(this.o);

    if (!Ardor._F.on) {
      Ardor._F.play();
    }
  }

  remove() {
    Ardor._F.kill(this.index);
  }
}
