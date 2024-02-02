import { sub, bounds, clamp, lerp, round, choke, iSet } from '../../index';
import Trigger from './trigger';

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
    this.dir = o.dir ? o.dir : 'y';
    this.ePage = this.dir == 'y' ? 'pageY' : 'pageX';

    this.o = o;
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
      if (o.key !== false) this.ikey = sub.add('keydown', this.key.bind(this));
      if (o.wheel !== false)
        this.iwheel = sub.add('wheel', this.wheel.bind(this));
    } else {
      if (o.drag !== false) {
        this.attacher.onpointerdown = this.down.bind(this);
        this.attacher.onpointermove = this.move.bind(this);
      }
      if (o.wheel !== false) this.attacher.onwheel = this.wheel.bind(this);
    }

    this.ipointerup = sub.add('pointerup', this.up.bind(this));
    this.iresize = sub.add('resize', this.resize.bind(this));

    this.drag = { x: 0, y: 0 };
    this.prev = { x: 0, y: 0 };
    this.scroll = { x: 0, y: 0 };
    this.dist = {
      x: { start: 0, end: 0 },
      y: { start: 0, end: 0 }
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
    this.offset = this.drag[this.dir];

    this.drag[this.dir] -= e.wheelDeltaY * multip;

    const offset = this.drag[this.dir] - this.offset;

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

    this.dist[this.dir].start = e[this.ePage];
    this.prev[this.dir] = this.drag[this.dir];
  }

  /**
   * drag / mouse-moveing
   */
  move(e) {
    if (this.downOn) {
      this.begin();

      this.time = e.timeStamp - this.time;
      this.offset = this.drag[this.dir];

      this.drag[this.dir] += -(e[this.ePage] - this.dist[this.dir].start);
      this.dist[this.dir].start = e[this.ePage];

      const offset = this.drag[this.dir] - this.offset;

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

      this.drag[this.dir] -= offset;
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
    this.drag[this.dir] = clamp(
      0,
      this.pageSize < 0 ? 0 : this.pageSize,
      this.drag[this.dir]
    );

    this.scroll[this.dir] = lerp(
      this.scroll[this.dir],
      this.drag[this.dir],
      this.ease
    );

    this.target.style.transform = `translate3d(-${this.scroll.x}px, -${this.scroll.y}px, 0)`;

    if (this.sub) this.sub.cb(this.scroll);
    if (round(this.scroll[this.dir], 2) == this.drag[this.dir]) this.iraf.r();
  }

  resize() {
    this.bs = bounds(this.target);
    const size = iSet.size;

    if (this.dir == 'y') this.pageSize = this.bs.h - size.h;
    else this.pageSize = this.bs.w - size.w;
  }

  /**
   * Remove events
   */
  destroy() {
    if (this.iraf) this.iraf.r();
    if (this.sub) this.sub.r();

    if (this.attacher === window) {
      if (this.ipointerdown) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }

      if (this.ikey) this.ikey.r();
      if (this.iwheel) this.iwheel.r();
    } else {
      if (this.o.drag !== false) {
        this.attacher.onpointerdown = null;
        this.attacher.onpointermove = null;
      }
      if (this.o.wheel) this.attacher.onwheel = null;
    }

    this.ipointerup.r();
    this.iresize.r();
  }
}

export default Scroll;
