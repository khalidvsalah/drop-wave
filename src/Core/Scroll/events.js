import sub from '../methods/observer';
import { choke, cssSet, query } from '../methods/methods';

export default class _events {
  constructor(target, options) {
    this.target = target;

    this.rafCb = options.rafCb;
    this.ePage = options.dir == 'y' ? 'pageY' : 'pageX';

    this.time = new Date().getTime();
    this.offset = 0;

    this.chokeEl = query.el('[overlay]');
    this.choke = new choke({
      late: 0.3,
      cb: () => cssSet.pointer(this.chokeEl, 'none')
    });

    this._init(options);
  }

  _init(options) {
    if (Object.is(this.target, window)) {
      if (options.drag !== false) {
        this.ipointerdown = sub.add('pointerdown', this._down.bind(this));
        this.ipointermove = sub.add('pointermove', this._event.bind(this));
      }

      if (options.key !== false) {
        this.ikey = sub.add('keydown', this._onkey.bind(this));
      }

      if (options.wheel !== false) {
        this.iwheel = sub.add('wheel', this._event.bind(this));
      }
    } else {
      if (options.drag !== false) {
        this.target.onpointerdown = this._down.bind(this);
        this.target.onpointermove = this._event.bind(this);
      }
    }

    this.ipointerup = sub.add('pointerup', this._up.bind(this));

    this.drag = 0;
    this.prev = 0;
    this.dist = { start: 0, end: 0 };
    this.scroll = { x: 0, y: 0 };
  }

  _wheel(e) {
    let multip = e.deltaMode == 1 ? 0.83 : 0.55;
    this.drag -= e.wheelDeltaY * multip;
  }

  _onkey(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
      let dist = 0;

      if (e.keyCode == 40) dist = -66.6;
      else if (e.keyCode == 38) dist = 66.6;

      this.drag -= dist;
    }
  }

  _down(e) {
    cssSet.pointer(this.chokeEl, 'all');
    this.mousedown = true;

    this.dist.start = e[this.ePage];
    this.prev = this.drag;
  }

  _move(e) {
    this.drag += -(e[this.ePage] - this.dist.start);
    this.dist.start = e[this.ePage];
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
  }

  _event(e) {
    this.rafCb();

    this.time = e.timeStamp - this.time;
    this.offset = this.drag;

    if (e.type == 'wheel') this._wheel(e);
    else if (this.mousedown) this._move(e);

    const offset = this.drag - this.offset;

    this.scroll.speed = Math.abs(offset / this.time);
    this.scroll.dir = Math.sign(offset);

    this.time = e.timeStamp;
  }

  _destroy() {
    if (Object.is(this.target, window)) {
      if (this.ipointerdown) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }

      if (this.ikey) this.ikey.r();
      if (this.iwheel) this.iwheel.r();
    } else {
      if (this.o.drag !== false) {
        this.target.onpointerdown = null;
        this.target.onpointermove = null;
      }
    }

    this.ipointerup.r();
  }
}
