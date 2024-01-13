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
  constructor(el, o, dir) {
    this.el = el;
    this.o = o;

    this.dir = dir;
    this.d = dir ? 'y' : 'x';

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
    this.iraf = sub.add(o.obsname, this.raf.bind(this));
  }

  /**
   * resize
   */
  resize() {
    if (this.pin) this.pin.bs = bounds(this.o.target);

    const bs = bounds(this.el.length ? this.el[0] : this.el);
    const screen = iSet.screen;

    this.screen = this.dir ? screen.h : screen.w;

    if (this.dir) {
      this.sp = bs.y;
      this.ep = bs.yE + this.screen;
    } else {
      this.sp = b.x;
      this.ep = b.xE + this.screen;
    }
  }

  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord;
    this.px = coord[this.d] + this.screen;

    let be = this.screen * (this.o.start || 0);
    let af = this.screen * (this.o.end || 0);

    if (this.o.scroll) {
      let start = this.sp + be;
      let end = this.ep + af;

      if (start <= this.px) this.in = true;
      if (end <= this.px) this.in = false;

      const dist = round(map(start, end, this.px), 3);
      this.scroll(dist);

      if (this.o.pin) this.piner(dist);
      if (this.o.raf) this.o.raf(dist, this.o.target, this.px);
    } else {
      if (before + this.start < this.px) this.fire();
    }
  }

  /**
   * Animate with scrolling
   */
  scroll(t) {
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

  /**
   * Pin Function
   */
  piner(t) {
    const pin = this.pin;

    if (t >= pin.start && !this.pined) {
      const offsetX = pin.bs.x - this.coord.x;
      const offsetY = pin.bs.y - this.coord.y;

      const clone = this.target.cloneNode(true);
      this.clone = clone;

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

      iSet.alpha(this.target, 0);
      this.pined = true;
    } else if (this.px >= pin.end) {
      this.parent.style.top = pin.end - this.px + 'px';
    } else if (t < pin.start) {
      if (this.clone && this.pined) {
        this.parent.removeChild(this.clone);
        this.pined = false;
      }

      iSet.alpha(this.target, 1);
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
