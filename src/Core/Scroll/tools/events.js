import observer from '../../Observer/observer';
import choke from '../../../Utils/methods/choke';
import query from '../../../Utils/methods/query';
import css from '../../../Utils/methods/css';

export default class Events {
  constructor(attacher, options) {
    this.options = options;

    this.attacher = attacher;
    this.target = options.target;

    this.observer = observer.create(options.obs || Symbol('foo'));

    this.dir = options.dir ? options.dir : 'y';
    this.isY = this.dir === 'y';
    this.pageDir = this.isY ? 'pageY' : 'pageX';

    this._events(options);

    this.chokeEl = query.id('overlay');
    this.choke = new choke({
      d: 0.3,
      cb: () => css.pointer(this.chokeEl, 'none')
    });

    this.dist = 0;
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  _events(options) {
    if (Object.is(this.attacher, window)) {
      if (options.drag !== false) {
        this.ipointerdown = observer
          .subscribe('pointerdown')
          .onChange(this._down.bind(this));
        this.ipointermove = observer
          .subscribe('pointermove')
          .onChange(this._move.bind(this));
      }
      if (options.key !== false) {
        this.ikey = observer
          .subscribe('keydown')
          .onChange(this._onkey.bind(this));
      }
      if (options.wheel !== false) {
        this.iwheel = observer
          .subscribe('wheel')
          .onChange(this._wheel.bind(this));
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

    this.ipointerup = observer
      .subscribe('pointerup')
      .onChange(this._up.bind(this));

    this.iresize = observer
      .subscribe('resize')
      .onChange(this._resize.bind(this));
  }

  _wheel(e) {
    this.loop();

    let multip = e.deltaMode === 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;
    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);
  }

  _onkey(e) {
    if (e.key === 'Tab') e.preventDefault();
    else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        this.loop();

        let offset = 0;
        if (e.keyCode === 40) offset = -66.6;
        else if (e.keyCode === 38) offset = 66.6;

        this.scroll.value -= offset;
      }
    }
  }

  _down(e) {
    this.mousedown = true;
    this.dist = e[this.pageDir];
  }

  _move(e) {
    if (this.mousedown) {
      this.loop();

      let offset = e[this.pageDir] - this.dist;
      this.scroll.value -= offset;
      this.dist = e[this.pageDir];
      this.scroll.dir = Math.sign(offset);

      if (this.global) css.pointer(this.chokeEl, 'all');
    }
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
  }

  _destroy() {
    this.iraf.r();
    this.iresize.r();

    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }

      if (this.ikey) this.ikey.r();
      if (this.iwheel) this.iwheel.r();
    } else {
      if (this.options.wheel !== false) {
        this.attacher.onwheel = null;
      }

      if (this.options.drag !== false) {
        this.attacher.onpointerdown = null;
        this.attacher.onpointermove = null;
      }
    }

    this.ipointerup.r();
    this.observer.r();
  }
}
