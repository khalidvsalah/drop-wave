import { states } from '../../../Utils/states/states';
import { choke } from '../../../Utils/methods/choke';
import { query } from '../../../Utils/methods/query';
import { setProp } from '../../../Utils/methods/css';

export default class Events {
  /**
   *  Class for handling scroll events
   *
   * @param {HTMLElement|Window} attacher - eventTarget
   * @param {object} options - properties
   */
  constructor(attacher, options) {
    this.options = options;

    this.attacher = attacher;
    this.target = options.target;

    this.states = states.create(options.obs || Symbol('foo'));

    this.dir = options.dir ? options.dir : 'y';
    this.isY = this.dir === 'y';
    this.pageDir = this.isY ? 'pageY' : 'pageX';

    this._events(options);

    this.chokeEl = query.id('overlay');
    this.choke = new choke({
      d: 0.3,
      cb: () => setProp.pointer(this.chokeEl, 'none')
    });

    this.dist = 0;
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  /**
   * @param {object} options - properties
   */
  _events(options) {
    if (Object.is(this.attacher, window)) {
      if (options.drag !== false) {
        this.ipointerdown = states.subscribe(
          'pointerdown',
          this._down.bind(this)
        );
        this.ipointermove = states.subscribe(
          'pointermove',
          this._move.bind(this)
        );
      }
      if (options.key !== false) {
        this.ikey = states.subscribe('keydown', this._onkey.bind(this));
      }
      if (options.wheel !== false) {
        this.iwheel = states.subscribe('wheel', this._wheel.bind(this));
      }
      this.global = true;
    } else {
      if (options.wheel !== false) {
        this.attacher.onwheel = this._wheel.bind(this);
      }

      if (options.drag !== false) {
        this.attacher.onpointerdown = this._down.bind(this);
        this.attacher.onpointermove = this._move.bind(this);
      }
    }

    this.ipointerup = states.subscribe('pointerup', this._up.bind(this));
    this.iresize = states.subscribe('resize', this._resize.bind(this));
  }

  /**
   *  Wheel
   */
  _wheel(e) {
    let multip = e.deltaMode === 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;
    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);
  }

  /**
   *  Keydown
   */
  _onkey(e) {
    if (e.key === 'Tab') e.preventDefault();
    else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        let offset = 0;
        if (e.keyCode === 40) offset = -66.6;
        else if (e.keyCode === 38) offset = 66.6;

        this.scroll.value -= offset;
      }
    }
  }

  /**
   *  mousedown
   */
  _down(e) {
    this.mousedown = true;
    this.dist = e[this.pageDir];
  }

  /**
   *  mousemove
   */
  _move(e) {
    if (this.mousedown) {
      let offset = e[this.pageDir] - this.dist;
      this.scroll.value -= offset;
      this.dist = e[this.pageDir];
      this.scroll.dir = Math.sign(offset);

      if (this.global) setProp.pointer(this.chokeEl, 'all');
    }
  }

  /**
   *  mouseup
   */
  _up() {
    this.mousedown = false;
    this.choke.run();
  }

  /**
   *  unsubscribe
   */
  _destroy() {
    this.iraf.remove();
    this.iresize.remove();

    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.remove();
        this.ipointermove.remove();
      }

      if (this.ikey) this.ikey.remove();
      if (this.iwheel) this.iwheel.remove();
    } else {
      this.attacher.onwheel = null;
      this.attacher.onpointerdown = null;
      this.attacher.onpointermove = null;
    }

    this.ipointerup.remove();
    this.states.remove();
  }
}
