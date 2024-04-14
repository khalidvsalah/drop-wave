import observer from '../Observer/observer';
import win from '../../Utils/methods/window';
import css from '../../Utils/methods/css';
import { bounds } from '../../Utils/methods/coordinate';
import { round, clamp, lerp } from '../../Math/math';

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
  }

  /**
   * Run on scolling
   */
  loop() {
    if (!this.iraf?.item.subscribed) {
      this.iraf = observer.subscribe('raf').onChange(this._raf.bind(this));
    }
  }

  add(target, o) {
    o.obsname = this.observer.name;
    o.dir = this.dir;

    const trigger = new Trigger(target, o);
    this.loop();
    return trigger;
  }

  _raf(t) {
    if (!this.infinite)
      this.scroll.value = round(clamp(0, this.dim, this.scroll.value));
    this.scroll.lerp = lerp(this.scroll.lerp, this.scroll.value, this.ease);

    const rounded = round(this.scroll.lerp);

    this.speed.time = t - this.speed.time;
    this.speed.offset = rounded - this.speed.offset;
    this.speed.value = lerp(
      this.speed.value,
      this.speed.offset / this.speed.time,
      this.speed.ease
    );

    if (this.infinite) {
      if (rounded > this.dim) {
        this.scroll.value = this.scroll.value - this.dim;
        this.scroll.lerp = rounded - this.dim;
      } else if (rounded < 0) {
        this.scroll.value = this.dim + this.scroll.value;
        this.scroll.lerp = this.dim + rounded;
      }

      this.infinite.map(([kid, bs]) => {
        const start = rounded;
        const end = start + this.screen;

        if (rounded > this.dim - this.screen) {
          const offsetS = rounded - (this.dim - this.screen) - this.screen;
          const offsetE = offsetS + this.screen;

          if (offsetS <= bs.z && offsetE >= bs.a)
            isYDir(kid, this.screen - offsetE, this.isY);
          else inRange(start, end, bs, kid, this.isY, rounded);
        } else inRange(start, end, bs, kid, this.isY, rounded);
      });
    } else isYDir(this.target, -rounded, this.isY);

    this.speed.time = t;
    this.speed.offset = rounded;

    this.observer.cb(this.scroll);
    if (rounded === this.scroll.value) this.iraf.r();
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
    this.loop();
  }
}

export default Scroll;
