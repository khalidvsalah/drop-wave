import { Sub, Tween, Bounds, Clamp, Lerp, Throttle } from "../../index";

class Scroll {
  constructor(ele, o = {}) {
    history.scrollRestoration = "manual";

    this.ease = o.ease || 0.1;
    this.dir = o.dir ? o.dir : "y";
    this.wheelLerp = o.wheelLerp || 0.2;
    this.dragLerp = o.dragLerp || 0.05;
    this.dragOn = o.drag;

    this.ele = ele;
    this.lerp = { x: 0, y: 0, lerp: this.ease };

    this.wheel = { x: 0, y: 0, lerp: this.wheelLerp };
    this.drag = {
      x: { s: 0, e: 0, sp: 0, ep: 0 },
      y: { s: 0, e: 0, sp: 0, ep: 0 },
      lerp: this.dragLerp,
    };

    if (this.dragOn) {
      this.smousedown = Sub.add("mousedown", this.onMDown.bind(this));
      this.smousemove = Sub.add("mousemove", this.onMM.bind(this));
      this.smouseup = Sub.add("mouseup", this.onMU.bind(this));
    }

    this.sresize = Sub.add("resize", this.Resize.bind(this));
    this.swheel = Sub.add("wheel", this.onWheel.bind(this));
    this.sraf = Sub.add("raf", this.raf.bind(this));

    this.rscroll = Sub.obs("scroll");

    this.all = document.getElementById("all");
    if (!this.all) {
      this.all = document.createElement("div");
      this.all.id = "all";

      document.body.appendChild(this.all);
    }

    this.throttle = new Throttle({
      late: 0.3,
      cb: () => {
        this.all.style.pointerEvents = "none";
      },
    });

    this.Resize();
  }

  onWheel(e) {
    this.lerp.x += e.deltaY * this.lerp.lerp;
    this.lerp.y += e.deltaY * this.lerp.lerp;

    this.all.style.pointerEvents = "all";
    this.throttle.run();
  }

  onMDown(e) {
    this.drag.y.s = e.pageY;
    this.drag.x.s = e.pageY;

    this.down = true;
  }

  onMM(e) {
    if (this.down) {
      this.all.style.pointerEvents = "all";
      this.throttle.run();

      if (this.dir === "y") {
        this.drag.y.prev = this.drag.y.e;
        this.drag.y.e = e.pageY;

        if (this.drag.y.d === 1) this.drag.y.sp = this.drag.y.e;
        if (this.drag.y.d === -1) this.drag.y.ep = this.drag.y.e;

        var diff = this.drag.y.e - this.drag.y.s;
        this.drag.y.d = Math.sign(this.drag.y.prev - this.drag.y.e) * -1;

        if (this.drag.y.d === -1) diff = this.drag.y.e - this.drag.y.sp;
        if (this.drag.y.d === 1) diff = this.drag.y.e - this.drag.y.ep;

        this.lerp.y = diff * -1 * this.drag.lerp + this.lerp.y;
      } else {
        this.drag.x.prev = this.drag.x.e;
        this.drag.x.e = e.pageX;

        if (this.drag.x.d === 1) this.drag.x.sp = this.drag.x.e;
        if (this.drag.x.d === -1) this.drag.x.ep = this.drag.x.e;

        var diff = this.drag.x.e - this.drag.x.s;
        this.drag.x.d = Math.sign(this.drag.x.prev - this.drag.x.e) * -1;

        if (this.drag.x.d === -1) diff = this.drag.x.e - this.drag.x.sp;
        if (this.drag.x.d === 1) diff = this.drag.x.e - this.drag.x.ep;

        this.lerp.x = diff * -1 * this.drag.lerp + this.lerp.x;
      }
    }
  }

  onMU() {
    this.down = false;
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
    this.lerp.x = Clamp(0, this.bounds.width - innerWidth, this.lerp.x);
    this.lerp.y = Clamp(0, this.bounds.height - innerHeight, this.lerp.y);

    let x = Lerp(this.wheel.x, this.lerp.x, this.wheel.lerp);
    let y = Lerp(this.wheel.y, this.lerp.y, this.wheel.lerp);

    this.wheel.x = x;
    this.wheel.y = y;

    if (this.dir === "y") {
      this.ele.style.transform = `translateY(${-this.wheel.y}px)`;
    } else {
      this.ele.style.transform = `translateX(${-this.wheel.x}px)`;
    }

    this.rscroll.cb(this.wheel);
  }

  Resize() {
    this.bounds = Bounds(this.ele);
  }

  destroy() {
    Sub.remove("wheel", this.swheel);
    Sub.remove("resize", this.sresize);
    Sub.remove("raf", this.sraf);

    if (this.dragOn) {
      Sub.remove("mousedown", this.smousedown);
      Sub.remove("mousemove", this.smousemove);
      Sub.remove("mouseup", this.smouseup);
    }
  }
}

export default Scroll;
