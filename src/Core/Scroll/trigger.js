import { tween, bounds, sub, map, props, ease, zero } from '../../index';

const match = (str, bs) => {
  let plus = str.match(/(\+|\-)(.*)/);
  if (plus) {
    if (plus[1] == '+') return bs + +plus[2];
    else if (plus[1] == '-') return bs - +plus[2];
  } else return +str;
};

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
    this.target = o.target;

    this.o = o;

    this.dir = dir;
    this.dirE = dir == 'y' ? 'yE' : 'xE';

    this.Init(o);
  }

  Init(o) {
    if (!o.target) this.target = this.el;
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

    this.sp = match(this.o.start || '+0', bs[this.dir]);
    this.ep = match(this.o.end || '+0', bs[this.dirE]);

    if (this.o.pin) {
      this.pin.start = match(this.pin.a || '+0', bs[this.dir]);
      this.pin.end = match(this.pin.z || '+0', bs[this.dirE]);
    }
  }

  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord[this.dir];

    let s = this.sp;
    let e = this.ep;

    if (this.o.scroll) {
      if (e < this.coord || s > this.coord) this.in = false;
      if (s <= this.coord) this.in = true;

      const dist = map(s, e, this.coord);
      if (this.in) this.scroll(dist);

      if (this.o.pin) this.piner();
      if (this.o.raf) this.o.raf(this.o.target, this.coord);
    } else if (s <= this.coord) this.fire();
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
      if (!(this.coord >= this.pin.end)) {
        const dist = zero(0, this.coord - this.pin.pxS);
        this.pin.target.style.transform = `translate3d(${
          this.dir ? '0px,' + dist + 'px' : dist + 'px,0px'
        },0px)`;
      }
    }

    if (this.coord < this.pin.start) this.pined = false;
    else if (this.coord >= this.pin.start && !this.pined) {
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
