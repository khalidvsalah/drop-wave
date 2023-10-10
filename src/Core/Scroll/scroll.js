import { Sub, Bounds, Clamp, Lerp, Round } from "../../index";
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

    this.ipointerdown = Sub.add("pointerdown", this.down.bind(this));
    this.ipointermove = Sub.add("pointermove", this.move.bind(this));
    this.ipointerup = Sub.add("pointerup", this.up.bind(this));
    this.iwheel = Sub.add("wheel", this.wheel.bind(this));

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

    this.iresize = Sub.add("resize", this.resize.bind(this));
    this.iraf = Sub.add("raf", this.raf.bind(this));

    this.sscroll = Sub.obs("scroll");
    this.sdrag = Sub.obs("drag");

    this.resize();
  }

  wheel(e) {
    this.lerp.x += e.deltaY * 0.5;
    this.lerp.y += e.deltaY * 0.5;

    this.dist.x += e.deltaX * 0.5;
    this.dist.y += e.deltaY * 0.5;
  }

  down(t) {
    let e = t;

    this.dn = true;

    this.drag.y.s = e.pageY;
    this.drag.x.s = e.pageX;

    this.prevLerp.x = this.lerp.x;
    this.prevLerp.y = this.lerp.y;

    this.prevDist.x = this.dist.x;
    this.prevDist.y = this.dist.y;
  }

  move(t) {
    let e = t;

    if (this.dn) {
      if (this.dir) {
        this.lerp.y = drag(this.drag.y, e.pageY) + this.prevLerp.y;
        this.dist.y = drag(this.drag.y, e.pageY) + this.prevDist.y;
      } else {
        this.lerp.x = drag(this.drag.x, e.pageX) + this.prevLerp.x;
        this.dist.x = drag(this.drag.x, e.pageX) + this.prevDist.x;
      }
    }

    this.sdrag.cb(this.dist);
    console.log(this.lerp, "-->><<--");
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

    this.lerp.x = Clamp(0, x < 0 ? 0 : x, this.lerp.x);
    this.lerp.y = Clamp(0, y < 0 ? 0 : y, this.lerp.y);

    this.scroll.x = Round(Lerp(this.scroll.x, this.lerp.x, this.ease));
    this.scroll.y = Round(Lerp(this.scroll.y, this.lerp.y, this.ease));

    this.el.style.transform = `translate3d(${-this.scroll.x}, ${-this.scroll
      .y}px, 0)`;

    this.sscroll.cb(this.scroll);
  }

  resize() {
    this.bs = Bounds(this.el);
  }

  destroy() {
    this.iresize.r();
    this.iraf.r();

    this.sscroll.r();
    this.sdrag.r();

    this.ipointerdown.r();
    this.ipointermove.r();
    this.ipointerup.r();
    this.iwheel.r();
  }
}

export default Scroll;
