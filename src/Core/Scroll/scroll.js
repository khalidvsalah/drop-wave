import observer from '../Observer/observer';
import win from '../../Utils/methods/window';
import css from '../../Utils/methods/css';
import { bounds } from '../../Utils/methods/coordinate';
import { clamp, damp } from '../../Math/math';

import Trigger from './tools/trigger';
import events from './tools/events';

const isYDir = (dom, value, isY) => {
  if (isY) css.form(dom, 'px', 0, value);
  else css.form(dom, 'px', value, 0);
};
const inRange = (start, end, bs, kid, isY, l) => {
  if (start <= bs.z && end >= bs.a) {
    isYDir(kid, -l, isY);
    bs.out = false;
  } else {
    if (!bs.out) {
      isYDir(kid, -l, isY);
      bs.out = true;
    }
  }
};

/**
 * Creating virtual scrolling
 */
class Scroll extends events {
  /**
   * @param {HTMLElement|Window} attacher - the parent
   * @param {Object} o - properties
   */
  constructor(attacher, o) {
    super(attacher, o);

    this.infinite = o.infinite;
    this.ease = o.ease || 0.09;

    this.speed = {
      time: performance.now(),
      offset: 0,
      value: 0,
      ease: o.speed || 0.3
    };

    this._resize();
    this.iraf = observer.subscribe('raf').onChange(this._raf.bind(this));
  }

  add(target, o) {
    o.obsname = this.observer.name;
    o.dir = this.dir;
    return new Trigger(target, o);
  }

  _raf(t) {
    if (!this.infinite)
      this.scroll.value = clamp(0, this.dim, this.scroll.value);
    this.scroll.lerp = damp(this.scroll.lerp, this.scroll.value, this.ease);

    this.speed.time = t - this.speed.time;
    this.speed.offset = this.scroll.lerp - this.speed.offset;
    this.speed.value = damp(
      this.speed.value,
      this.speed.offset / this.speed.time,
      this.speed.ease
    );

    if (this.infinite) {
      if (this.scroll.lerp > this.dim) {
        this.scroll.value = this.scroll.value - this.dim;
        this.scroll.lerp = this.scroll.lerp - this.dim;
      } else if (this.scroll.lerp < 0) {
        this.scroll.value = this.dim + this.scroll.value;
        this.scroll.lerp = this.dim + this.scroll.lerp;
      }

      this.infinite.map(([kid, bs]) => {
        const start = this.scroll.lerp;
        const end = start + this.screen;

        if (this.scroll.lerp > this.dim - this.screen) {
          const offsetS =
            this.scroll.lerp - (this.dim - this.screen) - this.screen;
          const offsetE = offsetS + this.screen;

          if (offsetS <= bs.z && offsetE >= bs.a)
            isYDir(kid, this.screen - offsetE, this.isY);
          else inRange(start, end, bs, kid, this.isY, this.scroll.lerp);
        } else inRange(start, end, bs, kid, this.isY, this.scroll.lerp);
      });
    } else isYDir(this.target, -this.scroll.lerp, this.isY);

    this.speed.time = t;
    this.speed.offset = this.scroll.lerp;

    console.log(this.scroll.lerp);

    this.observer.cb(this.scroll);
  }

  _resize() {
    this.bs = bounds(this.target);

    if (this.infinite) {
      const childs = [...this.target.children];
      this.infinite = childs.map(kid => {
        const a = this.isY ? kid.offsetTop : kid.offsetLeft;
        const z = this.isY ? kid.offsetHeight : kid.offsetWidth;
        return [kid, { a, z: a + z }];
      });
    }

    const d = this.isY ? 'h' : 'w';
    this.screen = win.screen[d];

    this.dim = this.bs[d] - (this.infinite ? 0 : this.screen);
  }
}

export default Scroll;
