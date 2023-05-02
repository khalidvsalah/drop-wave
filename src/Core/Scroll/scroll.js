import { Sub, TL, Bounds, Clamp, Lerp, Raf, Throttle } from "../../index";

class Scroll {
  constructor(ele, { ease = 0.1, lerp = 0.1, drag = true } = {}) {
    this.ele = ele;
    this.e = { x: 0, y: 0, lerp: ease };

    this.mouse = { x: 0, y: 0, lerp };
    this.drag = { s: 0, e: 0, sp: 0, ep: 0, lerp: ease * 0.1, on: false };

    if (!Sub.subCheck("wheel"))
      window.addEventListener("wheel", Sub.subF("wheel").cb);
    this.wId = Sub.subC("wheel", this.onWheel.bind(this));

    if (drag) {
      if (!Sub.subCheck("mousedown"))
        window.addEventListener("mousedown", Sub.subF("mousedown").cb);
      if (!Sub.subCheck("mousemove"))
        window.addEventListener("mousemove", Sub.subF("mousemove").cb);
      if (!Sub.subCheck("mouseup"))
        window.addEventListener("mouseup", Sub.subF("mouseup").cb);

      this.mdId = Sub.subC("mousedown", this.onMDown.bind(this));
      this.mmId = Sub.subC("mousemove", this.onMM.bind(this));
      this.muId = Sub.subC("mouseup", this.onMU.bind(this));
    }

    this.Bounds();
    if (!Sub.subCheck("raf")) {
      Raf.push({ d: -1, cb: Sub.subF("raf").cb });
      Raf.play();
    }
    this.rafId = Sub.subC("raf", this.raf.bind(this));
    this.ScrollId = Sub.subF("scroll");

    this.all = document.getElementById("all");

    if (!this.all) {
      this.all = document.createElement("div");
      this.all.id = "all";
      document.body.appendChild(this.all);
    }

    this.thr = new Throttle({
      delay: 0.4,
      cb: () => {
        this.all.style.pointerEvents = "none";
      },
    });
  }

  Bounds() {
    this.bounds = Bounds(this.ele);
  }

  onWheel(e) {
    this.e.x += e.deltaX * this.e.lerp;
    this.e.y += e.deltaY * this.e.lerp;
    this.all.style.pointerEvents = "all";
    this.thr.run();
  }

  onMDown(e) {
    this.drag.on = true;
    this.drag.s = e.pageY;
  }

  onMM(e) {
    this.drag.prev = this.drag.e;
    this.drag.e = e.pageY;

    if (this.drag.on) {
      if (this.drag.d === 1) this.drag.sp = this.drag.e;
      if (this.drag.d === -1) this.drag.ep = this.drag.e;

      var diff = this.drag.e - this.drag.s;
      this.drag.d = Math.sign(this.drag.prev - this.drag.e) * -1;

      diff;
      if (this.drag.d === -1) diff = this.drag.e - this.drag.sp;
      if (this.drag.d === 1) diff = this.drag.e - this.drag.ep;

      this.e.y = diff * -1 * this.drag.lerp + this.e.y;

      this.all.style.pointerEvents = "all";
      this.thr.run();
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

    var id = Sub.subC(this.ScrollId.name, (e) => {
      var y = e.y + window.innerHeight;
      var pr = (o.s / 100) * window.innerHeight;

      if (pr + bounds.top <= y) {
        var tl = new TL();

        this.elements.map((ele) => {
          tl.to(ele, ps);
          tl.play();
        });

        Sub.subCR(this.ScrollId.name, id);
      }
    });

    return id;
  }

  raf() {
    this.e.x = Clamp(0, this.bounds.width, this.e.x);
    this.e.y = Clamp(0, this.bounds.height - window.innerHeight, this.e.y);

    this.mouse.x = Lerp(this.mouse.x, this.e.x, this.mouse.lerp);
    this.mouse.y = Lerp(this.mouse.y, this.e.y, this.mouse.lerp);

    this.ele.style.transform = `translateY(${-this.mouse.y}px)`;
    this.ScrollId.cb(this.mouse);
  }

  destroy() {
    Sub.subCR("wheel", this.wId);
    this.mdId && Sub.subCR("mousedown", this.mdId);
    this.mmId && Sub.subCR("mousemove", this.mmId);
    this.muId && Sub.subCR("mouseup", this.muId);
    Sub.subCR("raf", this.rafId);
  }
}

export default Scroll;
