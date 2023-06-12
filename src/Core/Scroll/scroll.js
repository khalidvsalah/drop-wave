import { Sub, Tween, Bounds, Clamp, Lerp, Raf, Throttle } from "../../index";

class Scroll {
  constructor(
    ele,
    { ease = 0.1, wheelLerp = 0.1, drag = true, dragLerp = 0.05 } = {}
  ) {
    history.scrollRestoration = "manual";

    this.ele = ele;
    this.lerp = { x: 0, y: 0, lerp: ease };

    this.wheel = { x: 0, y: 0, lerp: wheelLerp };
    this.drag = { s: 0, e: 0, sp: 0, ep: 0, lerp: dragLerp, on: false };

    if (!Sub.check("wheel")) {
      window.addEventListener("wheel", Sub.obs("wheel").cb);
    }

    if (!Sub.check("resize")) {
      window.addEventListener("resize", Sub.obs("resize").cb);
    }

    if (drag) {
      if (!Sub.check("mousedown"))
        window.addEventListener("mousedown", Sub.obs("mousedown").cb);
      if (!Sub.check("mousemove"))
        window.addEventListener("mousemove", Sub.obs("mousemove").cb);
      if (!Sub.check("mouseup"))
        window.addEventListener("mouseup", Sub.obs("mouseup").cb);

      this.mdId = Sub.add("mousedown", this.onMDown.bind(this));
      this.mmId = Sub.add("mousemove", this.onMM.bind(this));
      this.muId = Sub.add("mouseup", this.onMU.bind(this));
    }

    this.Resize();

    if (!Sub.check("raf")) {
      Raf.push({ d: -1, cb: Sub.obs("raf").cb });
    }

    this.wId = Sub.add("wheel", this.onWheel.bind(this));
    this.resizeId = Sub.add("resize", this.Resize.bind(this));
    this.rafId = Sub.add("raf", this.raf.bind(this));
    this.scrollId = Sub.obs("scroll");

    this.all = document.getElementById("all");
    if (!this.all) {
      this.all = document.createElement("div");
      this.all.id = "all";

      document.body.appendChild(this.all);
    }

    this.thr = new Throttle({
      delay: 0.3,
      cb: () => {
        this.all.style.pointerEvents = "none";
      },
    });
  }

  onWheel(e) {
    this.lerp.x += e.deltaX * this.lerp.lerp;
    this.lerp.y += e.deltaY * this.lerp.lerp;

    this.all.style.pointerEvents = "all";
    this.thr.run();
  }

  onMDown(e) {
    this.drag.s = e.pageY;
    this.drag.on = true;
  }

  onMM(e) {
    if (this.drag.on) {
      this.all.style.pointerEvents = "all";
      this.thr.run();

      this.drag.prev = this.drag.e;
      this.drag.e = e.pageY;

      if (this.drag.d === 1) this.drag.sp = this.drag.e;
      if (this.drag.d === -1) this.drag.ep = this.drag.e;

      var diff = this.drag.e - this.drag.s;
      this.drag.d = Math.sign(this.drag.prev - this.drag.e) * -1;

      if (this.drag.d === -1) diff = this.drag.e - this.drag.sp;
      if (this.drag.d === 1) diff = this.drag.e - this.drag.ep;

      this.lerp.y = diff * -1 * this.drag.lerp + this.lerp.y;
    }
  }

  onMU() {
    this.drag.on = false;
  }

  add(ele, o) {
    if (!ele || !o) console.error("You need to provide a ele and o");

    let bounds;

    if (ele.length) bounds = Bounds(ele[0]);
    else bounds = Bounds(ele);

    let id = Sub.add(this.scrollId.name, (e) => {
      let y = e.y + window.innerHeight;
      let pr = ((o.s || 0) / 100) * window.innerHeight;

      if (pr + bounds.top <= y) {
        o.o && Tween(ele, o.o);
        o.cb && o.cb();
        Sub.remove(this.scrollId.name, id);
      }
    });

    return id;
  }

  raf() {
    this.lerp.x = Clamp(0, this.bounds.width, this.lerp.x);
    this.lerp.y = Clamp(
      0,
      this.bounds.height - window.innerHeight,
      this.lerp.y
    );

    let x = Lerp(this.wheel.x, this.lerp.x, this.wheel.lerp);
    let y = Lerp(this.wheel.y, this.lerp.y, this.wheel.lerp);

    this.wheel.x = x;
    this.wheel.y = y;

    this.ele.style.transform = `translateY(${-this.wheel.y}px)`;
    this.scrollId.cb(this.wheel);
  }

  Resize() {
    this.bounds = Bounds(this.ele);
  }

  destroy() {
    Sub.remove("wheel", this.wId);
    Sub.remove("resize", this.resizeId);
    Sub.remove("raf", this.rafId);

    this.mdId && Sub.remove("mousedown", this.mdId);
    this.mmId && Sub.remove("mousemove", this.mmId);
    this.muId && Sub.remove("mouseup", this.muId);
  }
}

export default Scroll;
