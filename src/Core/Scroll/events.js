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

    this.dist = 0;
    this.scroll = 0;
    this.virtual = { value: 0, dir: 1, speed: 1 };

    this.roll = { value: 0, virtual: 0 };
  }

  _wheel(e) {
    let multip = e.deltaMode == 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;

    this.scroll -= offset;
    this.roll.value -= offset;
  }

  _onkey(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
      let offset = 0;

      if (e.keyCode == 40) offset = -66.6;
      else if (e.keyCode == 38) offset = 66.6;

      this.scroll -= offset;
      this.roll.value -= offset;
    }
  }

  _down(e) {
    cssSet.pointer(this.chokeEl, 'all');
    this.mousedown = true;

    this.dist = e[this.ePage];
  }

  _move(e) {
    let offset = e[this.ePage] - this.dist;

    this.scroll -= offset;
    this.roll.value -= offset;

    this.dist = e[this.ePage];
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
  }

  _event(e) {
    if (e.type == 'wheel' || this.mousedown) {
      this.time = e.timeStamp - this.time;
      this.offset = this.scroll;

      this.rafCb();

      if (e.type == 'wheel') this._wheel(e);
      else if (this.mousedown) this._move(e);

      const offset = this.scroll - this.offset;

      this.virtual.speed = Math.abs(offset / this.time);
      this.virtual.dir = Math.sign(offset);

      this.time = e.timeStamp;
    }
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
