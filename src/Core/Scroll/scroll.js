import { Sub, Tween, Bounds, Clamp, Lerp, Throttle } from "../../index";

function drag(dir, e) {
  dir.prev = dir.e;
  dir.e = e;

  if (dir.d === 1) dir.sp = dir.e;
  if (dir.d === -1) dir.ep = dir.e;

  let diff = dir.e - dir.s;
  dir.d = Math.sign(dir.prev - dir.e) * -1;

  if (dir.d === -1) diff = dir.e - dir.sp;
  if (dir.d === 1) diff = dir.e - dir.ep;

  return diff * -1 * (this.ease * 0.55);
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
        this.target.onmousedown = this.onMDown.bind(this);
        this.target.onmousemove = this.onMM.bind(this);
        this.target.onmouseup = this.onMU.bind(this);
      }

      if (o.wheel) this.target.onwheel = this.onWheel.bind(this);
    } else {
      if (o.drag) {
        this.imousedown = Sub.add("mousedown", this.onMDown.bind(this));
        this.imousemove = Sub.add("mousemove", this.onMM.bind(this));
        this.imouseup = Sub.add("mouseup", this.onMU.bind(this));
      }

      if (o.wheel) {
        this.iwheel = Sub.add("wheel", this.onWheel.bind(this));
      }
    }

    this.iresize = Sub.add("resize", this.Resize.bind(this));
    this.iraf = Sub.add("raf", this.raf.bind(this));

    this.iscroll = Sub.obs("scroll");

    this.all = document.getElementById("all");
    this.throttle = new Throttle({
      late: 0.3,
      cb: () => {
        this.all.style.pointerEvents = "none";
      },
    });

    this.Resize();
  }

  onWheel(e) {
    this.lerp.x += e.deltaY * (this.ease * 2);
    this.lerp.y += e.deltaY * (this.ease * 2);

    this.all.style.pointerEvents = "all";
    this.throttle.run();
  }

  onMDown(e) {
    this.drag.y.s = e.pageY;
    this.drag.x.s = e.pageX;

    this.down = true;
  }

  onMM(e) {
    if (this.down) {
      this.all.style.pointerEvents = "all";
      this.throttle.run();

      if (this.dir) {
        this.lerp.y = drag.call(this, this.drag.y, e.pageY) + this.lerp.y;
      } else {
        this.lerp.x = drag.call(this, this.drag.x, e.pageX) + this.lerp.x;
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

  Resize() {
    this.bounds = Bounds(this.el);
  }

  destroy() {
    Sub.remove("resize", this.iresize);
    Sub.remove("raf", this.iraf);

    if (this.target instanceof Node) {
      if (this.dragOn) {
        this.target.onmousedown = null;
        this.target.onmousemove = null;
        this.target.onmouseup = null;
      }

      if (this.wheelOn) this.target.onwheel = null;
    } else {
      if (this.dragOn) {
        Sub.remove("mousedown", this.imousedown);
        Sub.remove("mousemove", this.imousemove);
        Sub.remove("mouseup", this.imouseup);
      }

      if (this.wheelOn) Sub.remove("wheel", this.iwheel);
    }
  }
}

export default Scroll;
