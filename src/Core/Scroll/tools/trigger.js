import observer from '../../Observer/observer';
import props from '../../../Utils/props/props';
import { map } from '../../../Math/math';
import tween from '../../tween/index';

const match = (str = '+0', bs) => {
  let plus = str.match(/(\+|\-)(.*)/);
  if (plus) {
    if (plus[1] == '+') return bs + +plus[2];
    else if (plus[1] == '-') return bs - +plus[2];
  } else return +str;
};

/**
 * Add tigger
 */
class Trigger {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   * @param {String} subname - Loop name
   * @param {Object} dir - scolling direction
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

  Init(o) {
    if (!o.target) this.target = this.el;
    if (o.scroll) this.ps = props(this.target, false, o.p);
    if (o.pin) this.pin.target = o.pin.target || this.target;

    this.iraf = observer.subscribe(o.obsname).onChange(this.raf.bind(this));
    this.iresize = observer
      .subscribe('resize')
      .onChange(this.resize.bind(this));
    this.resize();
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
   */
  raf(coord) {
    this.coord = coord.lerp;

    if (this.o.scroll) {
      const remap = map(this.startpint, this.endpoint, this.coord);
      this.onScroll(remap);
      if (this.o.pin) this.piner();
      if (this.o.raf) this.o.raf(remap, this.target, this.coord);
    } else if (this.startpint <= this.coord) this.fire();
  }

  /**
   * Animate with scrolling
   */
  onScroll(t) {
    const diraction = Math.abs(t - this.from);
    this.ps.map(p => {
      if (this.target.length)
        this.target.forEach(el => p.setV(el, p.cb(diraction)));
      else p.setV(this.target, p.cb(diraction));
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
  destroy() {
    this.iraf.r();
    this.iresize.r();
  }
}

export default Trigger;
