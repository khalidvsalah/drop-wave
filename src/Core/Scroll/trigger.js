import { tween, bounds, sub, map, props, round, iSet, ease } from '../../index';

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
  constructor(el, o, scroll, dir) {
    this.el = el;
    this.o = o;

    this.coord = scroll;

    this.dir = dir;
    this.d = dir ? 'y' : 'x';

    this.Init(o);
  }

  Init(o) {
    if (!o.target) {
      o.target = this.el;
    }
    if (o.scroll) {
      const node = o.target.length ? o.target[0] : o.target;

      this.ps = props(node, false, o.p);
      this.ease = ease[o.ease || 'l'];
    }
    if (o.pin) {
      this.piners = iSet.id('piners');
      this.pin = o.pin;

      const node = iSet.node('div');
      const bs = bounds(o.target);

      this.pin.bs = bs;

      const css = `
        position: fixed;
        top: 0; left: 0;
        height: 100%; width: 100%;
      `;

      node.className = 'piner';
      node.style.cssText = css;

      this.pinEnd = false;
      this.parent = node;

      this.piners.appendChild(node);
    }

    this.iresize = sub.add('resize', this.resize.bind(this));
    this.resize();
    this.iraf = sub.add('raf', this.raf.bind(this, this.coord));
  }

  /**
   * resize
   */
  resize() {
    if (this.pin) this.pin.bs = bounds(this.o.target);
    const bs = bounds(this.el.length ? this.el[0] : this.el);

    if (this.dir) {
      this.start = bs.y;
      this.end = bs.yE;
    } else {
      this.start = b.x;
      this.end = b.xE;
    }

    const screen = iSet.screen;
    this.size = this.dir ? screen.h : screen.w;
  }

  /**
   * Loop
   */
  raf(e) {
    this.px = e[this.d] + this.size;

    let before = (this.o.start || 0) * this.size;
    let after = (this.o.end || 0) * this.size;

    if (this.o.scroll) {
      let start = this.start + before;
      let end = this.end + this.size + after;

      if (start <= this.px) this.in = true;
      if (end <= this.px) this.in = false;

      this.scroll(map(start, end, this.px));
    } else {
      if (before + this.start < this.px) this.fire();
    }
  }

  /**
   * Animate with scrolling
   */
  scroll(t) {
    if (this.o.pin) this.piner(t);
    if (this.o.raf) this.o.raf(t, this.o.target, this.px);

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

  piner(t) {
    const r = round(t);
    const bs = this.pin.bs;

    if (r >= this.pin.start && !this.pined) {
      const offsetX = bs.x - this.coord.x;
      const offsetY = bs.y - this.coord.y;
      const clone = this.o.target.cloneNode(true);

      iSet.visible(this.o.target, 'hidden');
      this.parent.appendChild(clone);

      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';

      const ps = props(clone, false, {
        form: {
          x: [offsetX, 'px'],
          y: [offsetY, 'px']
        }
      });
      ps.map(({ setV, cb }) => setV(clone, cb(1)));

      this.clone = clone;
      this.pined = true;
    } else if (this.px >= this.pin.end) {
      this.parent.style.top = this.pin.end - this.px + 'px';
    } else if (r < this.pin.start) {
      iSet.visible(this.o.target, 'visible');

      if (this.clone && this.pined) {
        this.parent.removeChild(this.clone);
        this.pined = false;
      }
    }
  }

  /**
   * remove events
   */
  destroy() {
    if (this.o.pin) this.piners.removeChild(this.parent);

    this.iraf.r();
    this.iresize.r();
  }
}

export default trigger;
