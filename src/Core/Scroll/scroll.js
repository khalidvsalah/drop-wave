import { states } from '../../Utils/states/states';
import { choke } from '../../Utils/methods/choke';
import { query } from '../../Utils/methods/query';
import { win } from '../../Utils/methods/window';
import { setProp } from '../../Utils/methods/css';
import { bounds } from '../../Utils/methods/coordinate';
import { clamp, damp } from '../../Math/math';

import { trigger } from './trigger';

/**
 * Scroll options
 * @typedef {{
 * name:string
 * container:object
 * wheel:boolean,
 * key:boolean,
 * drag:boolean,
 * dir:string,
 * speed:number,
 * infinite:boolean,
 * onUpdate:Function,
 * }} SCROLL_OPTIONS
 */

/**
 * Trigger options
 * @typedef {{
 * container:HTMLElement,
 * animate:object,
 * tween:object,
 * scroll: boolean,
 * start:string|number,
 * end:string|number,
 * pin:{start:string|number, end:start|number},
 * onUpdate:Function
 * }} TRIGGER_OPTIONS
 */

const isYDir = (element, value, isYaxis) => {
  if (isYaxis) {
    setProp.transform(element, `translate3d(0, ${value}px, 0)`);
  } else {
    setProp.transform(element, `translate3d(${value}px, 0, 0)`);
  }
};
const inRange = (start, end, coords, kid, isYaxis, l) => {
  if (start <= coords.size && end >= coords.axis) {
    isYDir(kid, -l, isYaxis);
    coords.out = false;
  } else {
    if (!coords.out) {
      isYDir(kid, -l, isYaxis);
      coords.out = true;
    }
  }
};

class events {
  init({ drag, key, wheel }) {
    if (Object.is(this.container, window)) {
      this.global = true;
      window.history.scrollRestoration = 'manual';

      if (drag) {
        this.ipointerdown = states.subscribe(
          'pointerdown',
          this._down.bind(this)
        );
        this.ipointermove = states.subscribe(
          'pointermove',
          this._move.bind(this)
        );
      }
      if (key) {
        this.ikey = states.subscribe('keydown', this._onkey.bind(this));
      }
      if (wheel) {
        this.iwheel = states.subscribe('wheel', this._wheel.bind(this));
      }
    } else {
      if (wheel) {
        this.target.onwheel = this._wheel.bind(this);
      }
      if (drag) {
        this.target.onpointerdown = this._down.bind(this);
        this.target.onpointermove = this._move.bind(this);
      }
    }

    this.ipointerup = states.subscribe('pointerup', this._up.bind(this));

    this.overlay = query.node('div');
    win.body.appendChild(this.overlay);

    this.overlay.id = 'overlay';
    this.overlay.style.cssText = `
      position: fixed; z-index: 999;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
    `;

    this.choke = new choke({
      d: 0.3,
      cb: () => {
        setProp.pointer(this.overlay, 'none');
      }
    });

    this.dist = 0;
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  _wheel(e) {
    let multip = e.deltaMode === 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;

    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);
  }

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

  _down(e) {
    this.mousedown = true;
    this.dist = e[this.vertical];
  }

  _move(e) {
    if (this.mousedown) {
      let offset = e[this.vertical] - this.dist;
      this.scroll.value -= offset;
      this.dist = e[this.vertical];
      this.scroll.dir = Math.sign(offset);

      if (this.global) setProp.pointer(this.overlay, 'all');
    }
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
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
export class scroll extends events {
  /**
   * @param {HTMLElement} target
   * @param {SCROLL_OPTIONS} options
   */
  constructor(target, options = {}) {
    if (!target) {
      if (typeof target === 'string') {
        throw new Error('Pass <HTMLElement>');
      } else if (typeof target === 'undefined') {
        throw new Error('Pass <HTMLElement>');
      }
    }

    super();

    const {
      name = Symbol(),
      container = window,
      dir = 'y',
      drag = true,
      wheel = true,
      key = true,
      speed = 0.09
    } = options;

    this.target = target;
    this.container = container;
    this.states = states.create(name);

    this.dir = dir === 'x' ? 'x' : 'y';
    this.isYaxis = this.dir === 'y';
    this.vertical = this.isYaxis ? 'pageY' : 'pageX';

    this.init({ drag, wheel, key });

    this.speed = speed;
    this.onUpdate = options.onUpdate;
    this.infinite = options.infinite;

    this._resize();
    this.iupdate = states.subscribe('raf', this._update.bind(this));
    this.iresize = states.subscribe('resize', this._resize.bind(this));
  }

  /**
   * @param {HTMLElement|NodeList} target - targeted element
   * @param {TRIGGER_OPTIONS} options - properties
   */
  add(target, options = {}) {
    options.channel = this.states.name;
    options.dir = this.dir;

    if (!target) {
      if (typeof target === 'string') {
        throw new Error('Pass <HTMLElement>');
      } else if (typeof target === 'undefined') {
        throw new Error('Pass <HTMLElement>');
      }
    }

    return new trigger(target, options);
  }

  _update(time) {
    if (!this.infinite) {
      this.scroll.value = clamp(0, this.height, this.scroll.value);
    }
    this.scroll.lerp = damp(this.scroll.lerp, this.scroll.value, this.speed);

    if (this.infinite) {
      if (this.scroll.lerp > this.height) {
        this.scroll.value = this.scroll.value - this.height;
        this.scroll.lerp = this.scroll.lerp - this.height;
      } else if (this.scroll.lerp < 0) {
        this.scroll.value = this.height + this.scroll.value;
        this.scroll.lerp = this.height + this.scroll.lerp;
      }

      this.heights.map(([kid, coords]) => {
        const start = this.scroll.lerp;
        const end = start + this.screen;
        if (this.scroll.lerp > this.height - this.screen) {
          const offsetS =
            this.scroll.lerp - (this.height - this.screen) - this.screen;
          const offsetE = offsetS + this.screen;
          if (offsetS <= coords.size && offsetE >= coords.axis) {
            isYDir(kid, this.screen - offsetE, this.isYaxis);
          } else {
            inRange(start, end, coords, kid, this.isYaxis, this.scroll.lerp);
          }
        } else {
          inRange(start, end, coords, kid, this.isYaxis, this.scroll.lerp);
        }
      });
    } else isYDir(this.target, -this.scroll.lerp, this.isYaxis);

    this.states.notify(this.scroll);
    if (this.onUpdate) this.onUpdate(time, this.scroll);
  }

  _resize() {
    this.coords = bounds(this.target);

    if (this.infinite) {
      const childs = [...this.target.children];
      this.heights = childs.map(child => {
        const axis = this.isYaxis ? child.offsetTop : child.offsetLeft;
        const size = this.isYaxis ? child.offsetHeight : child.offsetWidth;
        return [child, { axis, size: axis + size }];
      });
    }

    const size = this.isYaxis ? 'h' : 'w';
    this.screen = win.screen[size];
    this.height = this.coords[size] - (this.infinite ? 0 : this.screen);
  }
}
