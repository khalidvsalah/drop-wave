import sub from '../methods/observer';
import { choke, cssSet, query } from '../methods/methods';
import setGlobalObses from './obses';

export default class _events {
  constructor(target, options) {
    this.target = target;

    this.rafCb = options.rafCb;
    this.ePage = options.dir == 'y' ? 'pageY' : 'pageX';

    setGlobalObses();
    this._init(options);

    this.chokeEl = query.el('[data-overlay]');
    this.choke = new choke({
      late: 0.3,
      cb: () => cssSet.pointer(this.chokeEl, 'none')
    });
  }

  _init(options) {
    if (Object.is(this.target, window)) {
      if (options.drag !== false) {
        this.ipointerdown = sub.add('pointerdown', this._down.bind(this));
        this.ipointermove = sub.add('pointermove', this._move.bind(this));
      }

      if (options.key !== false) {
        this.ikey = sub.add('keydown', this._onkey.bind(this));
      }

      if (options.wheel !== false) {
        this.iwheel = sub.add('wheel', this._wheel.bind(this));
      }

      this.globalScroll = true;
      this.globalevents = sub.obs('globalevents').cb;
    } else {
      if (options.wheel !== false) {
        this.target.onwheel = this._wheel.bind(this);
      }

      if (options.drag !== false) {
        this.target.onpointerdown = this._down.bind(this);
        this.target.onpointermove = this._move.bind(this);
      }
    }

    this.ipointerup = sub.add('pointerup', this._up.bind(this));

    this.dist = 0;
    this.scroll = 0;
    this.virtual = { value: 0, dir: 1 };
    this.speed = { value: 0, lerp: 0 };

    this.roll = { value: 0, virtual: 0 };
  }

  _wheel(e) {
    this.rafCb();

    let multip = e.deltaMode == 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;

    this.scroll -= offset;
    this.roll.value -= offset;

    this.virtual.dir = Math.sign(offset);
    this.globalevents(offset);
  }

  _onkey(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
      this.rafCb();

      let offset = 0;

      if (e.keyCode == 40) offset = -66.6;
      else if (e.keyCode == 38) offset = 66.6;

      this.scroll -= offset;
      this.roll.value -= offset;

      this.globalevents(offset);
    }
  }

  _down(e) {
    if (this.globalScroll) cssSet.pointer(this.chokeEl, 'all');
    this.mousedown = true;

    this.dist = e[this.ePage];
  }

  _move(e) {
    if (this.mousedown) {
      this.rafCb();

      let offset = e[this.ePage] - this.dist;

      this.scroll -= offset;
      this.roll.value -= offset;

      this.dist = e[this.ePage];

      this.virtual.dir = Math.sign(offset);

      this.globalevents(offset);
    }
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
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
