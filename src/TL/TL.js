import T from "./T.js";

class TL {
  constructor() {
    this.count = 0;
    this.items = [];
  }

  /*
      to(element, o, less or more (time)) {
      for(let i = 0; i < this.items.length; i++) {
        if(i === 0) {
          this.items.push(new Tr(element, {o}));
        }else {
          this.items.push(new Tr(element, {...o, delay: o.delay + this.items[i - 1].delay}));
        }
      }
      }
    */

  to(element, o) {
    if (this.count === 0) {
      this.items.push(new T(element, o));
    } else {
      this.items.push(
        new T(element, {
          ...o,
          delay: this.items[this.count - 1].del + this.items[this.count - 1].d,
        })
      );
    }
    ++this.count;
  }

  play() {
    this.items.map((t) => {
      t.play();
    });
  }
}

export default TL;
