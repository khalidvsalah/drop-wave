import { observer } from '../utils/Observer';
import { Choke } from '../methods/choke';
import { raf } from '../utils/Raf';
import { win } from '../methods/window';
import { css } from '../methods/css';

import { keyCodes } from './keycodes';

export default class Events {
  #choke = new Choke({
    d: 0.3,
    cb: () => {
      css.set(this.overlay, 'pointer-events', 'none');
    },
  });

  #dist = 0;

  constructor() {
    this.#overlay();
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  init({ drag, key, wheel, name }) {
    this.observer = observer.create(name);

    if (Object.is(this.container, window)) {
      this.global = true;

      window.history.scrollRestoration = 'manual';

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
      this.target.onpointerdown = this.#_down.bind(this);
      this.target.onpointermove = this.#_move.bind(this);
    }

    if (!observer.check('raf')) {
      raf.push({ cb: observer.create('raf').notify });
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

  #overlay() {
    const isOverlay = document.querySelector('[data-overlay]');

    if (!isOverlay) {
      this.overlay = document.createElement('div');
      win.body.appendChild(this.overlay);
      this.overlay.setAttribute('data-overlay', '');
      this.overlay.style.cssText = `
        position: fixed; z-index: 999;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
      `;
    } else this.overlay = isOverlay;
  }

  #_wheel(e) {
    const multip = e.deltaMode === 1 ? 0.83 : 0.55;
    const offset = e.wheelDeltaY * multip;

    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);
  }

  #_onkey(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
    } else {
      switch (e.keyCode) {
        case keyCodes.LEFT:
        case keyCodes.UP:
          this.scroll.value -= 66.6;
          break;
        case keyCodes.RIGHT:
        case keyCodes.DOWN:
          this.scroll.value += 66.6;
          break;

        case keyCodes.SPACE:
          this.scroll.value -= win.screen.h * 0.75 * (e.shiftKey ? 1 : -1);
          break;
      }
    }
  }

  #_down(e) {
    this.mousedown = true;
    this.#dist = e[this.axis];
  }

  #_move(e) {
    if (this.mousedown) {
      const offset = e[this.axis] - this.#dist;
      this.scroll.value -= offset;
      this.#dist = e[this.axis];
      this.scroll.dir = Math.sign(offset);

      if (this.global) css.set(this.overlay, 'pointer-events', 'all');
    }
  }

  #_up() {
    this.mousedown = false;
    this.#choke.run();
  }

  _destroy() {
    this.iupdate.unsubscribe();
    this.iresize.unsubscribe();

    this.ipointerup.unsubscribe();
    this.observer.unsubscribe();

    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.unsubscribe();
        this.ipointermove.unsubscribe();
      }

      if (this.ikey) this.ikey.unsubscribe();
      if (this.iwheel) this.iwheel.unsubscribe();
    } else {
      this.target.onwheel = null;
      this.target.onpointerdown = null;
      this.target.onpointermove = null;
    }
  }
}
