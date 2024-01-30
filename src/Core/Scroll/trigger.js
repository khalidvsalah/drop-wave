import { tween, bounds, sub, map, props, ease, zero } from '../../index';

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
    this.dE = dir ? 'yE' : 'xE';

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
    const bs = bounds(this.target.length ? this.target[0] : this.target);

    if (this.dir) {
      this.sp = bs.y;
      this.ep = bs.yE;
    } else {
      this.sp = bs.x;
      this.ep = bs.xE;
    }
  }

  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord[this.d];

    let start = this.o.start || this.sp;
    let end = this.o.end || this.ep;

    if (this.o.scroll) {
      if (end < this.coord || start > this.coord) this.in = false;
      if (start <= this.coord) this.in = true;

      const dist = map(start, end, this.coord);
      if (this.in) this.scroll(dist);

      if (this.o.pin) this.piner(dist);
      if (this.o.raf) this.o.raf(this.o.target, dist, this.coord);
    } else if (start <= this.coord) this.fire();
  }

  /**
   * Animate with scrolling
   */
  scroll(t) {
    this.ps.map(p => {
      if (this.o.target.length) {
        this.o.target.forEach(el => p.setV(el, p.cb(this.ease(t))));
      } else {
        p.setV(this.o.target, p.cb(this.ease(t)));
      }
    });
  }

  /**
   * If passed fire
   */
  fire() {
    if (this.o.tween) tween(this.target, this.o.tween);
    if (this.o.completed) this.o.completed(this.target);
    this.destroy();
  }

  /**
   * Pin Function
   */
  piner() {
    if (this.pined) {
      if (!(this.coord >= this.pin.z)) {
        const dist = zero(0, this.coord - this.pin.pxS);
        this.pin.target.style.transform = `translate3d(${
          this.dir ? '0px,' + dist + 'px' : dist + 'px,0px'
        },0px)`;
      }
    }

    if (this.coord < this.pin.a) this.pined = false;
    else if (this.coord >= this.pin.a && !this.pined) {
      this.pin.pxS = this.coord;
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
