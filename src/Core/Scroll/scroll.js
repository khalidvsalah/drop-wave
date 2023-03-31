import sub from "../../Utils/Sub/sub.js";
import Timeline from "../Timeline/timeline.js";
import Raf from "../../Animation/Raf/raf.js";

import { Bounds } from "../../Utils/Methods/methods.js";
import { Clamp, Lerp } from "../Math/math.js";

class Scroll {
  constructor(ele, { ease = 0.1, lerp = 0.1, drag = true }) {
    this.ele = ele;
    this.e = { x: 0, y: 0, lerp: ease };

    this.mouse = { x: 0, y: 0, lerp };
    this.drag = { s: 0, e: 0, sp: 0, ep: 0, lerp: lerp * 0.1, on: false };

    if (!sub.subCheck("wheel")) {
      window.addEventListener("wheel", sub.subF("wheel").cb);
    }
    this.wId = sub.subC("wheel", this.onWheel.bind(this));

    if (drag) {
      if (!sub.subCheck("mousedown")) {
        window.addEventListener("mousedown", sub.subF("mousedown").cb);
      }
      if (!sub.subCheck("mousemove")) {
        window.addEventListener("mousemove", sub.subF("mousemove").cb);
      }
      if (!sub.subCheck("mouseup")) {
        window.addEventListener("mouseup", sub.subF("mouseup").cb);
      }

      this.mdId = sub.subC("mousedown", this.onMDown.bind(this));
      this.mmId = sub.subC("mousemove", this.onMM.bind(this));
      this.muId = sub.subC("mouseup", this.onMU.bind(this));
    }

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

  onWheel(e) {
    this.e.x += e.deltaX * this.e.lerp;
    this.e.y += e.deltaY * this.e.lerp;

    this.e.x = Clamp(0, this.coord.w, this.e.x);
    this.e.y = Clamp(0, this.coord.h - window.innerHeight, this.e.y);
  }

  onMDown(e) {
    this.drag.on = true;
    this.drag.s = e.pageY;
  }

  onMM(e) {
    if (this.drag.on) {
      this.drag.prev = this.drag.e;
      if (this.drag.d === 1) this.drag.sp = this.drag.e;
      if (this.drag.d === -1) this.drag.ep = this.drag.e;

      this.drag.e = e.pageY;

      var diff = this.drag.e - this.drag.s;
      this.drag.d = Math.sign(this.drag.prev - this.drag.e) * -1;

      var diff;
      if (this.drag.d === -1) diff = this.drag.e - this.drag.sp;
      if (this.drag.d === 1) diff = this.drag.e - this.drag.ep;

      this.e.y = diff * -1 * this.drag.lerp + this.e.y;
      this.e.y = Clamp(0, this.coord.h - window.innerHeight, this.e.y);
    }
  }

  onMU() {
    this.drag.on = false;
  }

  add(ele, o) {
    if (!ele || !o) console.error("You need to provide a ele and o");

    if (Array.isArray(ele)) this.elements = ele;
    else this.elements = [ele];

    var bounds = Bounds(ele);
    var ps = o.tw;

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
    sub.subCR("wheel", this.wId.name);
    sub.subCR("mousedown", this.mdId);
    sub.subCR("mousemove", this.mmId);
    sub.subCR("mouseup", this.muId);
  }
}

export default Scroll;
