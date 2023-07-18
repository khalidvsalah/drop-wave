import { Sub, Bounds, Clamp, Lerp, Throttle, iSet } from "../../index";
import Trigger from "./trigger";

function drag(dir, e) {
  dir.prev = dir.e;
  dir.e = e;

  if (dir.d === 1) dir.sp = dir.e;
  if (dir.d === -1) dir.ep = dir.e;

  let diff = dir.e - dir.s;
  dir.d = Math.sign(dir.prev - dir.e) * -1;

  if (dir.d === -1) diff = dir.e - dir.sp;
  if (dir.d === 1) diff = dir.e - dir.ep;

  return diff * -1 * (this.ease * 0.3);
}
class Scroll {
  constructor(el, o = {}) {
    history.scrollRestoration = "manual";
    this.el = el;
    this.target = o.target || window;

    this.ease = o.ease || 0.1;
    this.dir = o.dir === undefined;

    this.dragOn = o.drag || true;
    this.wheelOn = o.wheel || true;

    this.lerp = { x: 0, y: 0 };
    this.wheel = { x: 0, y: 0 };

    this.drag = {
      x: { s: 0, e: 0, sp: 0, ep: 0 },
      y: { s: 0, e: 0, sp: 0, ep: 0 },
    };

    if (this.target instanceof Node) {
      if (o.drag) {
        this.target.onmousedown = this.down.bind(this);
        this.target.onmousemove = this.move.bind(this);
        this.target.onmouseup = this.up.bind(this);
      }

      if (o.wheel) this.target.onwheel = this.ewheel.bind(this);
    } else {
      if (this.dragOn) {
        this.imousedown = Sub.add("mousedown", this.down.bind(this));
        this.imousemove = Sub.add("mousemove", this.move.bind(this));
        this.imouseup = Sub.add("mouseup", this.up.bind(this));
      }

      if (this.wheelOn) {
        this.iwheel = Sub.add("wheel", this.ewheel.bind(this));
      }
    }

    this.iresize = Sub.add("resize", this.resize.bind(this));
    this.iraf = Sub.add("raf", this.raf.bind(this));

    this.iscroll = Sub.obs("scroll");

    this.all = document.getElementById("all");
    this.throttle = new Throttle({
      late: 0.3,
      cb: () => iSet.p(this.all, "none"),
    });

    this.resize();
  }

  ewheel(e) {
    this.lerp.x += e.deltaY * (this.ease + this.ease * 6);
    this.lerp.y += e.deltaY * (this.ease + this.ease * 6);

    iSet.p(this.all, "all");
    this.throttle.run();
  }

  down(e) {
    iSet.p(this.all, "all");

    this.drag.y.s = e.pageY;
    this.drag.x.s = e.pageX;
    this.dn = true;
  }

  move(e) {
    if (this.dn) {
      iSet.p(this.all, "all");
      this.throttle.run();

      if (this.dir) {
        this.lerp.y = drag.call(this, this.drag.y, e.pageY) + this.lerp.y;
      } else {
        this.lerp.x = drag.call(this, this.drag.x, e.pageX) + this.lerp.x;
      }
    }
  }

  up() {
    this.dn = false;
  }

  add(el, o) {
    new Trigger(el, o, this.iscroll.name, this.dir);
  }

  raf() {
    let x = this.bounds.width - window.innerWidth;
    let y = this.bounds.height - window.innerHeight;

    this.lerp.x = Clamp(0, x < 0 ? 0 : x, this.lerp.x);
    this.lerp.y = Clamp(0, y < 0 ? 0 : y, this.lerp.y);

    this.wheel.x = Lerp(this.wheel.x, this.lerp.x, this.ease);
    this.wheel.y = Lerp(this.wheel.y, this.lerp.y, this.ease);

    if (this.dir) this.el.style.transform = `translateY(${-this.wheel.y}px)`;
    else this.el.style.transform = `translateX(${-this.wheel.x}px)`;

    this.iscroll.cb(this.wheel);
  }

  resize() {
    this.bounds = Bounds(this.el);
  }

  destroy() {
    this.iresize.r();
    this.iraf.r();

    if (this.target instanceof Node) {
      if (this.dragOn) {
        this.target.onmousedown = null;
        this.target.onmousemove = null;
        this.target.onmouseup = null;
      }

      if (this.wheelOn) this.target.onwheel = null;
    } else {
      if (this.dragOn) {
        this.imousedown.r();
        this.imousemove.r();
        this.imouseup.r();
      }

      if (this.wheelOn) this.iwheel.r();
    }
  }
}

export default Scroll;
