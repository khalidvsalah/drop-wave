import { Sub, TL, Bounds, Clamp, Lerp } from "../../index";

class Scroll {
  constructor(ele, { ease = 0.1, lerp = 0.1, drag = true }) {
    this.ele = ele;
    this.e = { x: 0, y: 0, lerp: ease };

    this.mouse = { x: 0, y: 0, lerp };
    this.drag = { s: 0, e: 0, sp: 0, ep: 0, lerp: lerp * 0.1, on: false };

    if (!Sub.subCheck("wheel")) {
      window.addEventListener("wheel", Sub.subF("wheel").cb);
    }
    this.wId = Sub.subC("wheel", this.onWheel.bind(this));

    if (drag) {
      if (!Sub.subCheck("mousedown")) {
        window.addEventListener("mousedown", Sub.subF("mousedown").cb);
      }
      if (!Sub.subCheck("mousemove")) {
        window.addEventListener("mousemove", Sub.subF("mousemove").cb);
      }
      if (!Sub.subCheck("mouseup")) {
        window.addEventListener("mouseup", Sub.subF("mouseup").cb);
      }

      this.mdId = Sub.subC("mousedown", this.onMDown.bind(this));
      this.mmId = Sub.subC("mousemove", this.onMM.bind(this));
      this.muId = Sub.subC("mouseup", this.onMU.bind(this));
    }

    this.bounds();
    Sub.subCheck("raf") && Sub.subC("raf", this.raf.bind(this));
    this.rafId = Sub.subF("scroll");
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

    var id = Sub.subC(this.rafId.name, (e) => {
      var y = e.y + window.innerHeight;
      var pr = (o.s / 100) * window.innerHeight;

      if (pr + bounds.top <= y) {
        var tl = new TL();

        this.elements.map((ele) => {
          tl.to(ele, ps);
          tl.play();
        });

        Sub.subCR(this.rafId.name, id);
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
    Sub.subCR("wheel", this.wId.name);
    Sub.subCR("mousedown", this.mdId);
    Sub.subCR("mousemove", this.mmId);
    Sub.subCR("mouseup", this.muId);
  }
}

export default Scroll;
