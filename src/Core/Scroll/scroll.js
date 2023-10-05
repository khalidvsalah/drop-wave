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
    this.target = o.target || window;
    this.d = o.type;

    this.ease = o.ease || 0.1;
    this.dir = o.dir == undefined;

    this.dragOn = o.drag || true;
    this.wheelOn = o.wheel || true;

    this.lerp = { x: 0, y: 0 };
    this.plerp = { x: 0, y: 0 };
    this.wheel = { x: 0, y: 0 };

    this.drag = {
      x: { s: 0, e: 0, sp: 0, ep: 0 },
      y: { s: 0, e: 0, sp: 0, ep: 0 },
    };

    if (this.target instanceof Node) {
      if (o.drag) {
        this.target.onpointerdown = this.down.bind(this);
        this.target.onpointermove = this.move.bind(this);
        this.target.onpointerup = this.up.bind(this);
      }

      if (o.wheel) this.target.onwheel = this.ewheel.bind(this);
    } else {
      if (this.dragOn) {
        this.ipointerdown = Sub.add("pointerdown", this.down.bind(this));
        this.ipointermove = Sub.add("pointermove", this.move.bind(this));
        this.ipointerup = Sub.add("pointerup", this.up.bind(this));
      }

      if (this.wheelOn) {
        this.iwheel = Sub.add("wheel", this.ewheel.bind(this));
      }
    }

    this.iresize = Sub.add("resize", this.resize.bind(this));
    this.iraf = Sub.add("raf", this.raf.bind(this));
    this.iscroll = Sub.obs("scroll");
    this.idist = Sub.obs("idist");

    this.all = document.getElementById("all");
    this.throttle = new Throttle({
      late: 0.3,
      cb: () => iSet.p(this.all, "none"),
    });

    this.resize();
  }

  ewheel(e) {
    this.lerp.x += e.deltaY * this.ease * 7;
    this.lerp.y += e.deltaY * this.ease * 7;

    iSet.p(this.all, "all");
    this.throttle.run();
  }

  down(t) {
    iSet.p(this.all, "all");

    let e = t;

    this.drag.y.s = e.pageY;
    this.drag.x.s = e.pageX;

    this.dn = true;

    this.plerp.y = this.lerp.y;
    this.plerp.x = this.lerp.x;
  }

  move(t) {
    let e = t;

    if (this.dn) {
      iSet.p(this.all, "all");
      this.throttle.run();

      if (this.dir) this.lerp.y = drag(this.drag.y, e.pageY) + this.plerp.y;
      else this.lerp.x = drag(this.drag.x, e.pageX) + this.plerp.x;
    }
  }

  up() {
    this.dn = false;
  }

  add(el, o) {
    new Trigger(el, o, this.iscroll.name, this.dir);
  }

  raf() {
    let x = this.bounds.w - window.innerWidth;
    let y = this.bounds.h - window.innerHeight;

    this.dist.x = this.lerp.x;
    this.dist.y = this.lerp.x;

    this.lerp.x = Clamp(0, x < 0 ? 0 : x, this.lerp.x);
    this.lerp.y = Clamp(0, y < 0 ? 0 : y, this.lerp.y);

    this.distance.x = Lerp(this.distance.x, this.dist.x, this.ease);
    this.distance.y = Lerp(this.distance.x, this.dist.x, this.ease);

    this.wheel.x = Lerp(this.wheel.x, this.lerp.x, this.ease);
    this.wheel.y = Lerp(this.wheel.y, this.lerp.y, this.ease);

    if (this.dir) this.el.style.transform = `translateY(${-this.wheel.y}px)`;
    else this.el.style.transform = `translateX(${-this.wheel.x}px)`;

    this.iscroll.cb(this.wheel);
    this.idist.cb(this.distance);
  }

  resize() {
    this.bounds = Bounds(this.el);
  }

  destroy() {
    this.iresize.r();
    this.iraf.r();
    this.iscroll.r();
    this.idist.r();

    if (this.target instanceof Node) {
      if (this.dragOn) {
        this.target.onmousedown = null;
        this.target.onmousemove = null;
        this.target.onmouseup = null;
      }

      if (this.wheelOn) this.target.onwheel = null;
    } else {
      if (this.dragOn) {
        this.ipointerdown.r();
        this.ipointermove.r();
        this.ipointerup.r();
      }

      if (this.wheelOn) this.iwheel.r();
    }
  }
}

export default Scroll;
