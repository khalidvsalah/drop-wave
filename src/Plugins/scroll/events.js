import { states } from '../../Utils/states/states';
import { Choke } from '../../Utils/methods/choke';
import { raf } from '../../Utils/raf/raf';
import { win } from '../../Utils/methods/window';
import { CSS } from '../../Utils/methods/css';

import { keyCodes } from './keycodes';

export default class Events {
  #choke = new Choke({
    d: 0.3,
    cb: () => {
      CSS.set(this.overlay, 'pointer-events', 'none');
    },
  });

  #dist = 0;

  constructor() {
    this.#overlay();
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  init({ drag, key, wheel }) {
    if (Object.is(this.container, window)) {
      this.global = true;

      window.history.scrollRestoration = 'manual';

      if (!states.check('pointerdown')) {
        window.onpointerdown = states.create('pointerdown').notify;
      }
      if (!states.check('pointermove')) {
        window.onpointermove = states.create('pointermove').notify;
      }
      if (!states.check('keydown')) {
        window.onkeydown = states.create('keydown').notify;
      }
      if (!states.check('wheel')) {
        window.onwheel = states.create('wheel').notify;
      }

      if (drag) {
        this.ipointerdown = states.subscribe(
          'pointerdown',
          this.#_down.bind(this)
        );
        this.ipointermove = states.subscribe(
          'pointermove',
          this.#_move.bind(this)
        );
      }
      if (key) {
        this.ikey = states.subscribe('keydown', this.#_onkey.bind(this));
      }
      if (wheel) {
        this.iwheel = states.subscribe('wheel', this.#_wheel.bind(this));
      }
    } else {
      this.target.onpointerdown = this.#_down.bind(this);
      this.target.onpointermove = this.#_move.bind(this);
    }

    if (!states.check('raf')) {
      raf.push({ cb: states.create('raf').notify });
    }
    if (!states.check('resize')) {
      window.onresize = states.create('resize').notify;
    }
    if (!states.check('pointerup')) {
      window.onpointerup = states.create('pointerup').notify;
    }

    this.iupdate = states.subscribe('raf', this._update.bind(this));
    this.iresize = states.subscribe('resize', this._resize.bind(this));
    this.ipointerup = states.subscribe('pointerup', this.#_up.bind(this));
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

      if (this.global) CSS.set(this.overlay, 'pointer-events', 'all');
    }
  }

  #_up() {
    this.mousedown = false;
    this.#choke.run();
  }

  _destroy() {
    this.iupdate.remove();
    this.iresize.remove();

    this.ipointerup.remove();
    this.states.remove();

    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.remove();
        this.ipointermove.remove();
      }

      if (this.ikey) this.ikey.remove();
      if (this.iwheel) this.iwheel.remove();
    } else {
      this.target.onwheel = null;
      this.target.onpointerdown = null;
      this.target.onpointermove = null;
    }
  }
}
