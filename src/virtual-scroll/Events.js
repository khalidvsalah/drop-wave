import { observer } from '../utils/Observer';
import { win } from '../methods/window';

import { raf } from '../utils/Raf';
import { keyCodes, scaler, device } from './utils/support';

export default class Events {
  #dist = 0;

  constructor() {
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  init({ drag, key, wheel, name }) {
    this.observer = observer.create(name);

    if (win.is(this.container, window)) {
      window.history.scrollRestoration = 'manual';
      this.global = true;

      if (!observer.check('pointerdown')) {
        window.onpointerdown = observer.create('pointerdown').notify;
      }
      if (!observer.check('pointermove')) {
        window.onpointermove = observer.create('pointermove').notify;
      }
      if (!observer.check('keydown')) {
        window.onkeydown = observer.create('keydown').notify;
      }
      if (!observer.check('wheel')) {
        window.onwheel = observer.create('wheel').notify;
      }

      if (drag) {
        this.ipointerdown = observer.subscribe(
          'pointerdown',
          this.#_down.bind(this)
        );
        this.ipointermove = observer.subscribe(
          'pointermove',
          this.#_move.bind(this)
        );
      }
      if (key) {
        this.ikey = observer.subscribe('keydown', this.#_onkey.bind(this));
      }
      if (wheel) {
        this.iwheel = observer.subscribe('wheel', this.#_wheel.bind(this));
      }
    } else {
      if (drag) {
        this.container.onpointerdown = this.#_down.bind(this);
        this.container.onpointermove = this.#_move.bind(this);
      }
      if (wheel) {
        this.container.onwheel = this.#_wheel.bind(this);
      }
    }

    if (!observer.check('raf')) {
      raf.push({ cb: observer.create('raf').notify, d: -1 });
    }
    if (!observer.check('resize')) {
      window.onresize = observer.create('resize').notify;
    }
    if (!observer.check('pointerup')) {
      window.onpointerup = observer.create('pointerup').notify;
    }

    this.iupdate = observer.subscribe('raf', this._update.bind(this));
    this.iresize = observer.subscribe('resize', this._resize.bind(this));
    this.ipointerup = observer.subscribe('pointerup', this.#_up.bind(this));
  }

  #_wheel(e) {
    let offset = e.wheelDeltaY || e.deltaY;

    if (device.isFirefox && e.deltaMode === 1) {
      offset *= scaler.mouse;
    }

    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);
  }

  #_onkey(e) {
    if (e.code === 'Tab') e.preventDefault();
    else {
      switch (e.code) {
        case keyCodes.LEFT:
        case keyCodes.UP:
          this.scroll.value -= 120;
          break;
        case keyCodes.RIGHT:
        case keyCodes.DOWN:
          this.scroll.value += 120;
          break;

        case keyCodes.SPACE:
          this.scroll.value -= (win.screen.h - 40) * (e.shiftKey ? 1 : -1);
          break;
      }
    }
  }

  #_down(e) {
    this.isMouseDown = true;
    this.#dist = e[this.axis];
  }

  #_move(e) {
    if (this.isMouseDown) {
      const offset = (e[this.axis] - this.#dist) * scaler.drag;
      this.scroll.value -= offset;
      this.#dist = e[this.axis];
      this.scroll.dir = Math.sign(offset);
    }
  }

  #_up() {
    this.isMouseDown = false;
  }

  _destroy() {
    this.iupdate.unsubscribe();
    this.iresize.unsubscribe();

    this.ipointerup.unsubscribe();
    this.observer.remove();

    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.unsubscribe();
        this.ipointermove.unsubscribe();
      }

      if (this.ikey) this.ikey.unsubscribe();
      if (this.iwheel) this.iwheel.unsubscribe();
    } else {
      this.container.onpointerdown = null;
      this.container.onpointermove = null;
      this.container.onwheel = null;
    }
  }
}
