import { observer } from '../utils/Observer';
import { win } from '../methods/window';

import { raf } from '../utils/Raf';
import { keyCodes, scaler, device } from './utils/support';

export class Events {
  init({ drag, key, wheel }) {
    if (win.is(this.wrapper, window)) {
      this.global = true;
      window.history.scrollRestoration = 'manual';

      if (key) {
        this.keyOn = true;
        this.wrapper.addEventListener('keydown', this.#_onkey.bind(this));
      }
    }

    if (drag) {
      this.dragOn = true;
      this.wrapper.addEventListener('pointerdown', this.#_down.bind(this));
      this.wrapper.addEventListener('pointermove', this.#_move.bind(this));
    }

    if (wheel) {
      this.wheelOn = true;
      this.wrapper.addEventListener('wheel', this.#_wheel.bind(this));
    }

    this.updateId = raf.push({ cb: this._update.bind(this), d: -1 });

    window.addEventListener('resize', this._resize.bind(this));
    window.addEventListener('pointerup', this.#_up.bind(this));
  }

  #_wheel(e) {
    if (!this.pause) {
      let offset = e.wheelDeltaY || e.deltaY;

      if (device.isFirefox && e.deltaMode === 1) {
        offset *= scaler.mouse;
      }

      this.scroll.value -= offset * this.offset;
      this.scroll.dir = Math.sign(offset);
    }
  }

  #_onkey(e) {
    if (!this.pause) {
      if (e.code === 'Tab') e.preventDefault();
      else {
        switch (e.code) {
          case keyCodes.LEFT:
          case keyCodes.UP:
            this.scroll.value -= 120 * this.offset;
            break;
          case keyCodes.RIGHT:
          case keyCodes.DOWN:
            this.scroll.value += 120 * this.offset;
            break;

          case keyCodes.SPACE:
            this.scroll.value -= (win.screen.h - 40) * (e.shiftKey ? 1 : -1);
            break;
        }
      }
    }
  }

  #_down(e) {
    if (!this.pause) {
      this.isMouseDown = true;
      this.startPoint = e[this.axis];
    }
  }

  #_move(e) {
    if (!this.pause) {
      if (this.isMouseDown) {
        const offset = (e[this.axis] - this.startPoint) * scaler.drag;
        this.scroll.value -= offset * this.offset;
        this.startPoint = e[this.axis];
        this.scroll.dir = Math.sign(offset);
      }
    }
  }

  #_up() {
    this.isMouseDown = false;
  }

  _destroy() {
    raf.kill(this.updateId);
    this.observer.resize.remove();

    this.iupdate.unsubscribe();

    window.removeEventListener('resize', this._resize.bind(this));
    window.removeEventListener('pointerup', this.#_up.bind(this));

    if (this.global) {
      if (this.keyOn) {
        this.wrapper.removeEventListener('keydown', this.#_onkey.bind(this));
      }
    } else {
      if (this.dragOn) {
        this.wrapper.removeEventListener('pointerdown', this.#_down.bind(this));
        this.wrapper.removeEventListener('pointermove', this.#_move.bind(this));
      }
      if (this.wheelOn) {
        this.wrapper.removeEventListener('onwheel', this.#_wheel.bind(this));
      }
    }
  }
}
