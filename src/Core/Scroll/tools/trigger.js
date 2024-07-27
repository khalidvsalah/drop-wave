import { states } from '../../../Utils/states/states';
import { prepare } from '../../../Utils/props/prepare';
import { map } from '../../../Math/math';
import { offset } from '../../../Utils/methods/coordinate';
import { tween } from '../../tween/tween';

const match = (str = '+0', bs) => {
  let plus;

  if (Array.isArray(str)) {
    plus = offset(str[0]).y + str[1];
    return plus;
  } else {
    plus = str.toString().match(/(\+|\-)(.*)/);
    if (plus[1] === '+') return bs + +plus[2];
    else if (plus[1] === '-') return bs - +plus[2];
  }
};

class Trigger {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {object} o - properties
   */
  constructor(el, o) {
    this.el = el;
    this.target = o.target;

    this.o = o;
    this.pin = o.pin;
    this.scroll = o.scroll;
    this.from = o.from ? 1 : 0;

    this.dir = o.dir;
    this.dirE = o.dir === 'y' ? 'yE' : 'xE';

    this.Init(o);
  }

  /**
   * Initializing the class
   *
   * @param {object} o - properties
   */
  Init(o) {
    if (!o.target) this.target = this.el;
    if (o.scroll) this.ps = prepare(this.target, false, o.p);
    if (o.pin) this.pin.target = o.pin.target || this.target;

    this.iraf = states.subscribe(o.obsname, this._raf.bind(this));
    this.iresize = states.subscribe('resize', this._resize.bind(this));
    this._resize();
  }

  /**
   * event: window on resize
   */
  _resize() {
    const element = this.el.length ? this.el[0] : this.el;
    const bs = offset(element);

    if (this.scroll) {
      this.startpint = match(this.scroll.start, bs[this.dir]);
      this.endpoint = match(this.scroll.end, bs[this.dirE]);
    } else {
      this.startpint = match(this.o.start, bs[this.dir]);
      this.endpoint = match(this.o.end, bs[this.dirE]);
    }

    if (this.pin) {
      this.pin.start = match(this.pin.a, bs[this.dir]);
      this.pin.end = match(this.pin.z, bs[this.dirE]);
    }
  }

  /**
   * Loop
   *
   * @param {object} coord - scroll positon info
   */
  _raf(coord) {
    this.coord = coord.lerp;

    if (this.o.scroll) {
      const remap = map(this.startpint, this.endpoint, this.coord);
      this._scroll(remap);
      if (this.o.pin) this.piner();
      if (this.o.raf) this.o.raf(remap, this.target, this.coord);
    } else if (this.startpint <= this.coord) this.fire();
  }

  /**
   * _scroll
   *
   * @param {number} t - mapped value from 0 => scroll end poition [0, 1]
   */
  _scroll(t) {
    const diraction = Math.abs(t - this.from);
    this.ps.map(p => {
      if (this.target.length)
        this.target.forEach(el => p.setV(el, p.cb(diraction)));
      else p.setV(this.target, p.cb(diraction));
    });
  }

  /**
   * Fire completed fun on passing
   */
  fire() {
    if (this.o.tween) tween(this.target, this.o.tween);
    if (this.o.completed) this.o.completed(this.target);
    this._destroy();
  }

  /**
   * Pin HTMLElement on the page
   */
  piner() {
    if (this.pined) {
      if (!(this.coord >= this.pin.end)) {
        const dist = Math.max(0, this.coord - this.pin.pxS);
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
  _destroy() {
    this.iraf.remove();
    this.iresize.remove();
  }
}

export default Trigger;
