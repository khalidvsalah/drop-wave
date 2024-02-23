import sub from '../methods/observer';
import { bounds, iSet, cssSet } from '../methods/methods';
import { round, clamp, lerp } from '../../Math/math';

import trigger from './trigger';
import events from './events';

const isYDir = (dom, value, isY) => {
  if (isY) cssSet.form(dom, 'px', 0, value);
  else cssSet.form(dom, 'px', value, 0);
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

    this.ease = o.ease || 0.09;
    this.infinite = o.infinite;
    this.sub = sub.obs(o.obs || Symbol('foo'));
    this.speed = {
      time: performance.now(),
      offset: 0,
      value: 0,
      ease: o.speed || 0.3
    };

    this.iresize = sub.add('resize', this.resize.bind(this));
    this.iraf = sub.add('raf', this.raf.bind(this));
    this.resize();
  }

  /**
   * Run on scolling
   */
  loop() {
    if (!this.iraf.item.on) this.iraf = sub.add('raf', this.raf.bind(this));
  }

  add(target, o) {
    o.obsname = this.sub.name;
    const tri = new trigger(target, o, this.dir);
    this.loop();
    return tri;
  }

  raf(t) {
    if (!this.kids) this.scroll.value = clamp(0, this.dim, this.scroll.value);
    this.scroll.lerp = lerp(this.scroll.lerp, this.scroll.value, this.ease);

    const rounded = round(this.scroll.lerp);

    this.speed.time = t - this.speed.time;
    this.speed.offset = rounded - this.speed.offset;
    this.speed.value = lerp(
      this.speed.value,
      this.speed.offset / this.speed.time,
      this.speed.ease
    );

    if (this.kids) {
      if (rounded > this.dim) {
        this.scroll.value = this.scroll.value - this.dim;
        this.scroll.lerp = rounded - this.dim;
      } else if (rounded < 0) {
        this.scroll.value = this.dim + this.scroll.value;
        this.scroll.lerp = this.dim + rounded;
      }

      this.kids.map(([kid, bs]) => {
        const start = rounded;
        const end = start + this.s;

        if (rounded > this.dim - this.s) {
          const offsetS = rounded - (this.dim - this.s) - this.s;
          const offsetE = offsetS + this.s;

          if (offsetS <= bs.z && offsetE >= bs.a)
            isYDir(kid, this.s - offsetE, this.isY);
          else inRange(start, end, bs, kid, this.isY, rounded);
        } else inRange(start, end, bs, kid, this.isY, rounded);
      });
    } else {
      isYDir(this.target, -rounded, this.isY);
    }

    this.speed.time = t;
    this.speed.offset = rounded;

    if (this.sub) this.sub.cb(rounded);
    if (rounded == this.scroll.value) this.iraf.r();
  }

  resize() {
    this.bs = bounds(this.target);

    if (this.infinite) {
      const childs = [...this.target.children];
      this.kids = childs.map(kid => {
        const a = this.isY ? kid.offsetTop : kid.offsetLeft;
        const z = this.isY ? kid.offsetHeight : kid.offsetWidth;
        return [kid, { a, z: a + z }];
      });
    }

    const d = this.isY ? 'h' : 'w';
    this.s = iSet.size[d];

    this.dim = this.bs[d] - (this.kids ? 0 : this.s);
    this.loop();
  }
}

export default Scroll;
