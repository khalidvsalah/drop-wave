import {
  tween,
  bounds,
  sub,
  map,
  props,
  round,
  iSet,
  ease,
  zero
} from '../../index';

/**
 * Add tigger
 */
class trigger {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   * @param {String} subname - Loop name
   * @param {Object} dir - scolling direction
   */
  constructor(el, o, dir) {
    this.el = el;
    this.o = o;

    this.dir = dir;
    this.d = dir ? 'y' : 'x';

    this.Init(o);
  }

  Init(o) {
    if (!o.target) {
      o.target = this.el;
      this.target = o.target;
    }
    if (o.scroll) {
      const node = o.target.length ? o.target[0] : o.target;

      this.ps = props(node, false, o.scroll);
      this.ease = ease[o.ease || 'l'];
    }
    if (o.pin) {
      this.pin = o.pin;
      this.pin.target = o.pin.target || this.target;
    }

    this.iresize = sub.add('resize', this.resize.bind(this));
    this.resize();
    this.iraf = sub.add(o.obsname, this.raf.bind(this));
  }

  /**
   * resize
   */
  resize() {
    const bs = bounds(this.el.length ? this.el[0] : this.el);
    const size = iSet.size;

    this.screen = this.dir ? size.h : size.w;

    if (this.dir) {
      this.sp = bs.y;
      this.ep = bs.yE + this.screen;
    } else {
      this.sp = b.x;
      this.ep = b.xE + this.screen;
    }
  }

  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord;
    this.px = coord[this.d] + this.screen;

    let be = this.screen * (this.o.start || 0);
    let af = this.screen * (this.o.end || 0);

    if (this.o.scroll) {
      let start = this.sp + be;
      let end = this.ep + af;

      if (start <= this.px) this.in = true;
      if (end <= this.px) this.in = false;

      const dist = round(map(start, end, this.px), 3);
      this.scroll(dist);

      if (this.o.pin) this.piner(dist);
      if (this.o.raf) this.o.raf(dist, this.o.target, this.px);
    } else {
      if (before + this.start < this.px) this.fire();
    }
  }

  /**
   * Animate with scrolling
   */
  scroll(t) {
    if (!this.in) return;
    this.ps.map((p) => {
      if (this.o.target.length) {
        this.o.target.forEach((el) => p.setV(el, p.cb(this.ease(t))));
      } else {
        p.setV(this.o.target, p.cb(this.ease(t)));
      }
    });
  }

  /**
   * If passed fire
   */
  fire() {
    if (this.o.tween) tween(this.o.target || this.el, this.o.tween);
    if (this.o.completed) this.o.completed(this.o.target);
    this.destroy();
  }

  /**
   * Pin Function
   */
  piner(t) {
    if (this.pined) {
      if (!(this.px >= this.pin.z)) {
        const dist = zero(0, this.px - this.pin.pxS);
        this.pin.target.style.transform = `translate3d(${
          this.dir ? '0px,' + dist + 'px' : dist + 'px,0px'
        },0px)`;
      }
    }

    if (t < this.pin.a) this.pined = false;
    else if (t >= this.pin.a && !this.pined) {
      this.pin.pxS = this.px;
      this.pined = true;
    }
  }

  /**
   * remove events
   */
  destroy() {
    this.iraf.r();
    this.iresize.r();
  }
}

export default trigger;
