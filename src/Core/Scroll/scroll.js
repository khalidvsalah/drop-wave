import { Sub, Bounds, Clamp, Lerp, Round } from "../../index";
import Trigger from "./trigger";

function drag(dir, e) {
  dir.prev = dir.e;
  dir.e = e;

  let diff = dir.e - dir.s;
  return -diff;
}
class Scroll {
  constructor(attacher, o) {
    history.scrollRestoration = "manual";
    this.attacher = attacher;

    this.target = o.target;

    this.ease = o.ease || 0.09;
    this.dir = o.dir == undefined;

    this.Init();
    this.resize();
  }

  Init() {
    if (this.attacher == window) {
      this.ipointerdown = Sub.add("pointerdown", this.down.bind(this));
      this.ipointermove = Sub.add("pointermove", this.move.bind(this));
      this.iwheel = Sub.add("wheel", this.wheel.bind(this));
    } else {
      this.attacher.onpointerdown = this.down.bind(this);
      this.attacher.onpointermove = this.move.bind(this);
      this.attacher.onwheel = this.wheel.bind(this);
    }

    this.ipointerup = Sub.add("pointerup", this.up.bind(this));

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

    this.sscroll = Sub.obs("scroll");
    this.sdrag = Sub.obs("drag");
  }

  begin() {
    if (!this.iraf || !this.iraf.item.on) {
      this.iraf = Sub.add("raf", this.raf.bind(this));
    }
  }

  wheel(e) {
    let multiplier = e.deltaMode == 1 ? 0.85 : 0.5;

    this.lerp.x -= e.wheelDeltaX * multiplier;
    this.lerp.y -= e.wheelDeltaY * multiplier;

    this.dist.x -= e.wheelDeltaX * multiplier;
    this.dist.y -= e.wheelDeltaY * multiplier;

    this.begin();
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

      this.sdrag.cb(this.dist);
      this.begin();
    }
  }

  up() {
    this.dn = false;
  }

  add(target, o) {
    new Trigger(target, o, this.sscroll.name, this.dir);
  }

  raf() {
    this.lerp.x = Clamp(0, this.w < 0 ? 0 : this.w, this.lerp.x);
    this.lerp.y = Clamp(0, this.h < 0 ? 0 : this.h, this.lerp.y);

    this.scroll.x = Round(Lerp(this.scroll.x, this.lerp.x, this.ease), 4);
    this.scroll.y = Round(Lerp(this.scroll.y, this.lerp.y, this.ease), 4);

    this.target.style.transform = `translate3d(-${this.scroll.x}px, -${this.scroll.y}px, 0)`;

    this.sscroll.cb(this.scroll);

    if (this.dir) {
      if (Round(this.scroll.y, 3) == this.lerp.y) this.iraf.r();
    } else {
      if (Round(this.scroll.x, 3) == this.lerp.x) this.iraf.r();
    }
  }

  resize() {
    this.bs = Bounds(this.target);
    this.w = this.bs.w - window.innerWidth;
    this.h = this.bs.h - window.innerHeight;
  }

  destroy() {
    this.iresize.r();
    this.iraf && this.iraf.r();

    this.sscroll.r();
    this.sdrag.r();

    if (this.attacher == window) {
      this.ipointerdown.r();
      this.ipointermove.r();
      this.ipointerup.r();
      this.iwheel.r();
    } else {
      this.attacher.onpointerdown = null;
      this.attacher.onpointermove = null;
      this.attacher.onpointerup = null;
      this.attacher.onwheel = null;
    }
  }
}

export default Scroll;
