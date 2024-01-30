import { sub, bounds, clamp, lerp, round, choke, iSet } from '../../index';
import Trigger from './trigger';

function drag(dir, e) {
  dir.prev = dir.end;
  dir.end = e;

  let diff = dir.end - dir.start;
  return -diff;
}

/**
 * Creating virtual scrolling
 */
class Scroll {
  /**
   * @param {HTMLElement|Window} attacher - the parent
   * @param {Object} o - properties
   */
  constructor(attacher, o) {
    history.scrollRestoration = 'manual';
    this.attacher = attacher;

    this.target = o.target;

    this.ease = o.ease || 0.09;
    this.dir = o.dir == undefined;
    this.d = this.dir ? 'y' : 'x';

    this.Init(o);

    this.sub = sub.obs(o.obs || Symbol('foo'));

    this.time = new Date().getTime();
    this.offset = 0;

    this.chokeEl = iSet.el('[overlay]');
    this.choke = new choke({
      late: 0.3,
      cb: () => iSet.pointer(this.chokeEl, 'none')
    });
  }

  /**
   * Initializing the virtial scrolling class
   */
  Init(o) {
    if (this.attacher == window) {
      if (o.drag !== false) {
        this.ipointerdown = sub.add('pointerdown', this.down.bind(this));
        this.ipointermove = sub.add('pointermove', this.move.bind(this));
      }
      this.iwheel = sub.add('wheel', this.wheel.bind(this));
      this.ikey = sub.add('keydown', this.key.bind(this));
    } else {
      if (o.drag !== false) {
        this.attacher.onpointerdown = this.down.bind(this);
        this.attacher.onpointermove = this.move.bind(this);
      }
      this.attacher.onwheel = this.wheel.bind(this);
    }

    this.ipointerup = sub.add('pointerup', this.up.bind(this));
    this.iresize = sub.add('resize', this.resize.bind(this));

    this.drag = { x: 0, y: 0 };
    this.prev = { x: 0, y: 0 };
    this.scroll = { x: 0, y: 0 };
    this.dist = {
      x: { start: 0, end: 0 },
      y: { start: 0, ende: 0 }
    };
  }

  /**
   * Run on scolling
   */
  begin() {
    if (!this.iraf || !this.iraf.item.on) {
      this.iraf = sub.add('raf', this.raf.bind(this));
    }
  }

  /**
   * Handling wheel event
   */
  wheel(e) {
    this.begin();
    let multip = e.deltaMode == 1 ? 0.83 : 0.55;

    this.time = e.timeStamp - this.time;
    this.offset = this.drag[this.d];

    this.drag.x -= e.wheelDeltaX * multip;
    this.drag.y -= e.wheelDeltaY * multip;

    const offset = this.drag[this.d] - this.offset;

    this.scroll.sp = Math.abs(offset / this.time);
    this.scroll.dir = Math.sign(offset);

    this.time = e.timeStamp;
  }

  /**
   * Starting point
   */
  down(e) {
    iSet.pointer(this.chokeEl, 'all');
    this.downOn = true;

    this.dist.y.start = e.pageY;
    this.dist.x.start = e.pageX;

    this.prev.x = this.drag.x;
    this.prev.y = this.drag.y;
  }

  /**
   * drag / mouse-moveing
   */
  move(e) {
    if (this.downOn) {
      this.begin();

      this.time = e.timeStamp - this.time;
      this.offset = this.drag[this.d];

      if (this.dir) this.drag.y = drag(this.dist.y, e.pageY) + this.prev.y;
      else this.drag.x = drag(this.dist.x, e.pageX) + this.prev.x;

      const offset = this.drag[this.d] - this.offset;

      this.scroll.sp = Math.abs(offset / this.time);
      this.scroll.dir = Math.sign(offset);

      this.time = e.timeStamp;
    }
  }

  key(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
      this.begin();
      let offset = 0;

      if (e.keyCode == 40) offset = -66.6;
      else if (e.keyCode == 38) offset = 66.6;

      this.drag.x -= offset;
      this.drag.y -= offset;
    }
  }

  /**
   * End point
   */
  up() {
    this.downOn = false;
    this.choke.run();
  }

  /**
   * Add Trigger
   */
  add(target, o) {
    o.obsname = this.sub.name;
    const trigger = new Trigger(target, o, this.dir);

    this.begin();
    return trigger;
  }

  raf() {
    this.drag.x = clamp(0, this.w < 0 ? 0 : this.w, this.drag.x);
    this.drag.y = clamp(0, this.h < 0 ? 0 : this.h, this.drag.y);

    this.scroll.x = round(lerp(this.scroll.x, this.drag.x, this.ease), 3);
    this.scroll.y = round(lerp(this.scroll.y, this.drag.y, this.ease), 3);

    if (this.sub) this.sub.cb(this.scroll);
    this.target.style.transform = `translate3d(-${this.scroll.x}px, -${this.scroll.y}px, 0)`;

    if (this.dir) {
      if (round(this.scroll.y, 2) == this.drag.y) this.iraf.r();
    } else {
      if (round(this.scroll.x, 2) == this.drag.x) this.iraf.r();
    }
  }

  resize() {
    this.bs = bounds(this.target);
    const size = iSet.size;

    this.w = this.bs.w - size.w;
    this.h = this.bs.h - size.h;
  }

  /**
   * Remove events
   */
  destroy() {
    if (this.iraf) this.iraf.r();
    if (this.sub) this.sub.r();

    if (this.attacher === window) {
      if (o.drag !== false) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }

      this.iwheel.r();
      this.ikey.r();
    } else {
      if (o.drag !== false) {
        this.attacher.onpointerdown = null;
        this.attacher.onpointermove = null;
      }
      this.attacher.onwheel = null;
    }

    this.ipointerup.r();
    this.iresize.r();
  }
}

export default Scroll;
