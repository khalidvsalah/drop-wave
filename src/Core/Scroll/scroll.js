import { Sub, Bounds, Clamp, Lerp, Throttle, iSet } from "../../index";
import Trigger from "./trigger";

function drag(dir, e) {
  dir.prev = dir.e;
  dir.e = e;

  let diff = dir.e - dir.s;
  return -diff;
}
class Scroll {
  constructor(el, o = {}) {
    history.scrollRestoration = "manual";

    this.el = el;

    this.ease = o.ease || 0.1;
    this.dir = o.dir == undefined;

    this.dragOn = o.drag || true;
    this.wheelOn = o.wheel || true;

    if (this.dragOn) {
      this.ipointerdown = Sub.add("pointerdown", this.down.bind(this));
      this.ipointermove = Sub.add("pointermove", this.move.bind(this));
      this.ipointerup = Sub.add("pointerup", this.up.bind(this));
    }

    if (this.wheelOn) {
      this.iwheel = Sub.add("wheel", this.wheel.bind(this));
    }

    this.all = iSet.id("all");
    this.throttle = new Throttle({
      late: 0.3,
      cb: () => iSet.p(this.all, "none"),
    });

    this.Init();
  }

  Init() {
    this.lerp = { x: 0, y: 0 };
    this.prevLerp = { x: 0, y: 0 };
    this.prevDist = { x: 0, y: 0 };
    this.scroll = { x: 0, y: 0 };

    this.drag = {
      x: { s: 0, e: 0, sp: 0, ep: 0 },
      y: { s: 0, e: 0, sp: 0, ep: 0 },
    };

    this.dist = { x: 0, y: 0 };
    this.distance = { x: 0, y: 0 };

    this.iresize = Sub.add("resize", this.resize.bind(this));
    this.iraf = Sub.add("raf", this.raf.bind(this));

    this.sscroll = Sub.obs("scroll");
    this.sdist = Sub.obs("dist");

    this.resize();
  }

  wheel(e) {
    this.lerp.x += e.deltaY * this.ease * 7;
    this.lerp.y += e.deltaY * this.ease * 7;

    this.dist.x += e.deltaY * this.ease * 7;
    this.dist.y += e.deltaY * this.ease * 7;

    iSet.p(this.all, "all");
    this.throttle.run();
  }

  down(t) {
    let e = t;

    this.drag.y.s = e.pageY;
    this.drag.x.s = e.pageX;

    this.dn = true;

    this.prevLerp.x = this.lerp.x;
    this.prevLerp.y = this.lerp.y;

    this.prevDist.x = this.dist.x;
    this.prevDist.y = this.dist.y;
  }

  move(t) {
    let e = t;

    if (this.dn) {
      iSet.p(this.all, "all");
      this.throttle.run();

      if (this.dir) {
        this.lerp.y = drag(this.drag.y, e.pageY) + this.prevLerp.y;
        this.dist.y = drag(this.drag.y, e.pageY) + this.prevDist.y;
      } else {
        this.lerp.x = drag(this.drag.x, e.pageX) + this.prevLerp.x;
        this.dist.x = drag(this.drag.x, e.pageX) + this.prevDist.x;
      }
    }
  }

  up() {
    this.dn = false;
  }

  add(el, o) {
    new Trigger(el, o, this.sscroll.name, this.dir);
  }

  raf() {
    let x = this.bs.w - window.innerWidth;
    let y = this.bs.h - window.innerHeight;

    this.distance.x = Lerp(this.distance.x, this.dist.x, this.ease);
    this.distance.y = Lerp(this.distance.y, this.dist.y, this.ease);

    this.lerp.x = Clamp(0, x < 0 ? 0 : x, this.lerp.x);
    this.lerp.y = Clamp(0, y < 0 ? 0 : y, this.lerp.y);

    this.scroll.x = Lerp(this.scroll.x, this.lerp.x, this.ease);
    this.scroll.y = Lerp(this.scroll.y, this.lerp.y, this.ease);

    if (this.dir) this.el.style.transform = `translateY(${-this.scroll.y}px)`;
    else this.el.style.transform = `translateX(${-this.scroll.x}px)`;

    this.sscroll.cb(this.scroll);
    this.sdist.cb(this.distance);
  }

  resize() {
    this.bs = Bounds(this.el);
  }

  destroy() {
    this.iresize.r();
    this.iraf.r();
    this.sscroll.r();
    this.sdist.r();

    if (this.dragOn) {
      this.ipointerdown.r();
      this.ipointermove.r();
      this.ipointerup.r();
    }

    if (this.wheelOn) this.iwheel.r();
  }
}

export default Scroll;
