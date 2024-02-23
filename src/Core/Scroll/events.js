import sub from '../methods/observer';
import { choke, cssSet, query } from '../methods/methods';
import setGlobalObses from './obses';

export default class _events {
  constructor(attacher, options) {
    this.options = options;

    this.attacher = attacher;
    this.target = options.target;

    this.dir = options.dir ? options.dir : 'y';
    this.isY = this.dir == 'y';
    this.ePage = options.dir == 'y' ? 'pageY' : 'pageX';

    this._init(options);

    this.chokeEl = query.el('[data-overlay]');
    this.choke = new choke({
      d: 0.3,
      cb: () => cssSet.pointer(this.chokeEl, 'none')
    });
  }

  _init(options) {
    setGlobalObses();

    if (Object.is(this.attacher, window)) {
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

      this.globalevents = sub.obs('globalevents').cb;
    } else {
      if (options.wheel !== false) {
        this.attacher.onwheel = this._wheel.bind(this);
      }

      if (options.drag !== false) {
        this.attacher.onpointerdown = this._down.bind(this);
        this.attacher.onpointermove = this._move.bind(this);
      }
    }

    this.ipointerup = sub.add('pointerup', this._up.bind(this));

    this.dist = 0;
    this.scroll = { value: 0, lerp: 0, dir: 1 };
    this.speed = { value: 0, lerp: 0 };
  }

  _wheel(e) {
    this.loop();

    let multip = e.deltaMode == 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;
    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);

    if (this.globalevents) this.globalevents(e, offset);
  }

  _onkey(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
      this.loop();

      let offset = 0;
      if (e.keyCode == 40) offset = -66.6;
      else if (e.keyCode == 38) offset = 66.6;
      this.scroll.value -= offset;

      if (this.globalevents) this.globalevents(e, offset);
    }
  }

  _down(e) {
    this.mousedown = true;
    this.dist = e[this.ePage];
  }

  _move(e) {
    if (this.mousedown) {
      this.loop();

      let offset = e[this.ePage] - this.dist;
      this.scroll.value -= offset;
      this.dist = e[this.ePage];
      this.scroll.dir = Math.sign(offset);

      if (this.globalevents) {
        cssSet.pointer(this.chokeEl, 'all');
        this.globalevents(e, offset);
      }
    }
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
  }

  _destroy() {
    this.iraf.r();
    this.sub.r();
    this.iresize.r();

    if (Object.is(this.attacher, window)) {
      if (this.ipointerdown) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }

      if (this.ikey) this.ikey.r();
      if (this.iwheel) this.iwheel.r();
    } else {
      if (this.options !== false) {
        this.attacher.onpointerdown = null;
        this.attacher.onpointermove = null;
      }
    }

    this.ipointerup.r();
  }
}
