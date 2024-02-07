import sub from '../methods/observer';
import { bounds, iSet, cssSet } from '../methods/methods';
import { round, clamp, lerp } from '../../Math/math';

import trigger from './trigger';
import events from './events';

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
    this.target = o.target;

    this.ease = o.ease || 0.09;
    this.dir = o.dir ? o.dir : 'y';

    this.sub = sub.obs(o.obs || Symbol('foo'));
    this.iresize = sub.add('resize', this.resize.bind(this));

    o.dir = this.dir;
    o.rafCb = this.loop.bind(this);

    this.events = new events(attacher, o);
  }

  /**
   * Run on scolling
   */
  loop() {
    if (!this.iraf || !this.iraf.item.on) {
      this.iraf = sub.add('raf', this.raf.bind(this));
    }
  }

  add(target, o) {
    o.obsname = this.sub.name;
    const tri = new trigger(target, o, this.dir);
    this.loop();
    return tri;
  }

  raf() {
    this.events.drag = clamp(0, this.pageSize, this.events.drag);
    this.events.scroll[this.dir] = lerp(
      this.events.scroll[this.dir],
      this.events.drag,
      this.ease
    );

    cssSet.form(
      this.target,
      'px',
      -this.events.scroll.x,
      -this.events.scroll.y
    );

    if (this.sub) this.sub.cb(this.events.scroll);
    if (round(this.events.scroll[this.dir], 2) == this.drag) this.iraf.r();
  }

  resize() {
    this.bs = bounds(this.target);

    if (this.dir == 'y') this.pageSize = this.bs.h - iSet.size.h;
    else this.pageSize = this.bs.w - iSet.size.w;

    this.loop();
  }

  /**
   * Remove events
   */
  destroy() {
    if (this.iraf) this.iraf.r();

    this.sub.r();
    this.iresize.r();
    this.events._destroy();
  }
}

export default Scroll;
