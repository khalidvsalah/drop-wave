import sub from "../../Utils/Sub/sub.js";
import Timeline from "../Timeline/timeline.js";
import Raf from "../../Animation/Raf/raf.js";

import { Bounds } from "../../Utils/Methods/methods.js";
import { Clamp, Lerp } from "../Math/math.js";

class Scroll {
  constructor(ele, { ease = 0.1, lerp = 0.1 } = {}) {
    this.ele = ele;
    this.e = { x: 0, y: 0, lerp: ease };
    this.mouse = { x: 0, y: 0, lerp };

    if (!sub.subCheck("wheel")) {
      window.addEventListener("wheel", sub.subF("wheel").cb);
    }
    this.id = sub.subC("wheel", this.event.bind(this));

    this.bounds();
    Raf.push({ d: -1, cb: this.raf.bind(this) });
    !Raf.on && Raf.play();
    this.rafId = sub.subF("scrollRaf");
  }

  bounds() {
    var bounds = Bounds(this.ele);

    this.coord = {
      h: bounds.height,
      w: bounds.width,
      t: bounds.top,
      b: bounds.bottom,
    };
  }

  event(e) {
    this.e.x += e.deltaX * this.e.lerp;
    this.e.y += e.deltaY * this.e.lerp;

    this.e.x = Clamp(0, this.coord.w, this.e.x);
    this.e.y = Clamp(0, this.coord.h - window.innerHeight, this.e.y);
  }

  add(ele, o) {
    if (!ele || !o) console.error("You need to provide a ele and o");

    if (Array.isArray(ele)) this.elements = ele;
    else this.elements = [ele];

    this.props = o.p;
    var bounds = Bounds(ele);
    var ps = { p: o.p, d: o.d, ease: o.ease, delay: o.delay ? o.delay : 0 };

    var id = sub.subC(this.rafId.name, (e) => {
      var y = e.y + window.innerHeight;
      var pr = (o.s / 100) * window.innerHeight;

      if (pr + bounds.top <= y) {
        var tl = new Timeline();

        this.elements.map((ele) => {
          tl.to(ele, ps);
          tl.play();
        });

        sub.subCR(this.rafId.name, id);
      }
    });

    return id;
  }

  raf() {
    this.mouse.x = Lerp(this.mouse.x, this.e.x, this.mouse.lerp);
    this.mouse.y = Lerp(this.mouse.y, this.e.y, this.mouse.lerp);

    this.ele.style.transform = `translateY(${-this.mouse.y}px)`;
    this.rafId.cb(this.mouse);
  }

  destroy() {
    sub.subCR("wheel", this.id);
  }
}

export default Scroll;
