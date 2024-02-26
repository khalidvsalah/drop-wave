import sub from '../methods/observer';
import props from '../../Utils/props/props';
import { map, zero } from '../../Math/math';
import ease from '../../Math/ease';
import tween from '../tween/index';

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
    if (o.scroll) this.ps = o.p ? props(this.target, false, o.p) : [];
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
    const element = this.el.length ? this.el[0] : this.el;
    const bs = {
      y: element.offsetTop,
      yE: element.offsetTop + element.offsetHeight,
      x: element.offsetLeft,
      xE: element.offsetLeft + element.offsetWidth
    };

    if (this.o.scroll) {
      this.startpint = match(this.o.scroll.start || '+0', bs[this.dir]);
      this.endpoint = match(this.o.scroll.end || '+0', bs[this.dirE]);
    } else {
      this.startpint = match(this.o.start || '+0', bs[this.dir]);
      this.endpoint = match(this.o.end || '+0', bs[this.dirE]);
    }

    if (this.o.pin) {
      this.pin.start = match(this.pin.a || '+0', bs[this.dir]);
      this.pin.end = match(this.pin.z || '+0', bs[this.dirE]);
    }
  }

  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord;

    if (this.o.scroll) {
      const remap = map(this.startpint, this.endpoint, this.coord);
      this.scroll(remap);

      if (this.o.pin) this.piner();
      if (this.o.raf) this.o.raf(remap, this.target, this.coord);
    } else if (this.startpint <= this.coord) this.fire();
  }

  /**
   * Animate with scrolling
   */
  scroll(t) {
    this.ps.map(p => {
      if (this.target.length) {
        this.target.forEach(el => p.setV(el, p.cb(t)));
      } else p.setV(this.target, p.cb(t));
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
