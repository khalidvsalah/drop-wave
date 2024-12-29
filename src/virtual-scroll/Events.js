import { win } from '../methods/window';
import { debounce } from '../methods/debounce';

import { raf } from '../utils/Raf';
import { keyCodes, multipliers, device } from './utils/support';

const KEYSTEPS = 120;

export class Events {
  constructor(options) {
    this.pause = false;
    this.scroll = { value: 0, dir: 1 };

    this.multiplier = options.multiplier;
    this.axis = options.isY ? 'pageY' : 'pageX';

    this.#init(options);
  }

  #init(options) {
    const { key, drag, wheel, wrapper, resize, update } = options;

    if (key && win.is(wrapper, document)) {
      this.keyOn = true;
      wrapper.addEventListener('keydown', this.#_onKey.bind(this));
    }
    if (drag) {
      this.dragOn = true;
      wrapper.addEventListener('touchstart', this.#_onDown.bind(this));
      wrapper.addEventListener('touchmove', this.#_onMove.bind(this));
      wrapper.addEventListener('touchend', this.#_onUp.bind(this));

      wrapper.addEventListener('mousedown', this.#_onDown.bind(this));
      wrapper.addEventListener('mousemove', this.#_onMove.bind(this));
      wrapper.addEventListener('mouseup', this.#_onUp.bind(this));
    }
    if (wheel) {
      this.wheelOn = true;
      wrapper.addEventListener('wheel', this.#_onWheel.bind(this));
    }

    this.updateId = raf.push({ cb: update, d: -1 });
    this.debounceResize = debounce({ time: 0.15, cb: resize });

    window.addEventListener('resize', this.debounceResize);
    resize();
  }

  #_onWheel(event) {
    if (!this.pause) {
      let offset = event.wheelDeltaY || event.deltaY;
      if (device.isFirefox && event.deltaMode === 1) {
        offset *= multipliers.mouse;
      }

      this.scroll.value -= offset * this.multiplier;
      this.scroll.dir = Math.sign(offset);
    }
  }

  #_onKey(event) {
    if (!this.pause) {
      if (event.code === 'Tab') {
        event.preventDefault();
      } else {
        const offset = KEYSTEPS * this.multiplier;
        switch (event.code) {
          case keyCodes.LEFT:
          case keyCodes.UP:
            this.scroll.value -= offset;
            break;
          case keyCodes.RIGHT:
          case keyCodes.DOWN:
            this.scroll.value += offset;
            break;
          case keyCodes.SPACE:
            this.scroll.value -=
              (win.screen.h - 40) * (event.shiftKey ? 1 : -1);
            break;
        }
      }
    }
  }

  #_onDown(event) {
    event = event.targetTouches ? event.targetTouches[0] : event;
    if (!this.pause) {
      this.isMouseDown = true;
      this.dragFirst = event[this.axis];
    }
  }

  #_onMove(event) {
    if (!this.pause) {
      if (this.isMouseDown) {
        event = event.targetTouches ? event.targetTouches[0] : event;

        const offset = (event[this.axis] - this.dragFirst) * multipliers.drag;
        this.scroll.value -= offset * this.multiplier;

        this.dragFirst = event[this.axis];
        this.scroll.dir = Math.sign(offset);
      }
    }
  }

  #_onUp() {
    this.isMouseDown = false;
  }

  destroy() {
    raf.kill(this.updateId);

    window.removeEventListener('resize', this.debounceResize);

    if (this.keyOn) {
      this.wrapper.removeEventListener('keydown', this.#_onKey.bind(this));
    }

    if (this.dragOn) {
      this.wrapper.removeEventListener('touchstart', this.#_onDown.bind(this));
      this.wrapper.removeEventListener('touchmove', this.#_onMove.bind(this));
      this.wrapper.removeEventListener('touchend', this.#_onUp.bind(this));

      this.wrapper.removeEventListener('mousedown', this.#_onDown.bind(this));
      this.wrapper.removeEventListener('mousemove', this.#_onMove.bind(this));
      this.wrapper.removeEventListener('mouseup', this.#_onUp.bind(this));
    }

    if (this.wheelOn) {
      this.wrapper.removeEventListener('wheel', this.#_onWheel.bind(this));
    }
  }
}
