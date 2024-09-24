import { states } from '../../Utils/states/states';

import { win } from '../../Utils/methods/window';
import { setProp } from '../../Utils/methods/css';
import { bounds } from '../../Utils/methods/coordinate';
import { clamp, damp } from '../../Math/math';

import Events from './events.js';
import Trigger from './trigger';

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

const isYDir = (element, value, isYaxis) => {
  if (isYaxis) {
    setProp.transform(element, `translate3d(0, ${value}px, 0)`);
  } else {
    setProp.transform(element, `translate3d(${value}px, 0, 0)`);
  }
};
const inRange = (start, end, coords, kid, isYaxis, l) => {
  if (start <= coords.dimensions && end >= coords.padding) {
    isYDir(kid, -l, isYaxis);
    coords.out = false;
  } else {
    if (!coords.out) {
      isYDir(kid, -l, isYaxis);
      coords.out = true;
    }
  }
};

export class scroll extends Events {
  /**
   * @param {HTMLElement} target
   * @param {SCROLL_OPTIONS} options
   */
  constructor(target, options = {}) {
    super();

    const {
      name = Symbol('virtual'),
      container = window,
      dir = 'y',
      drag = true,
      wheel = true,
      key = true,
      speed = 0.09,
    } = options;

    this.target = target;
    this.container = container;
    this.states = states.create(name);

    this.dir = dir === 'x' ? 'x' : 'y';
    this.isYaxis = this.dir === 'y';
    this.axis = this.isYaxis ? 'pageY' : 'pageX';

    this.init({ drag, wheel, key });

    this.speed = speed;
    this.onUpdate = options.onUpdate;
    this.infinite = options.infinite;

    this._resize();
    this.iupdate = states.subscribe('raf', this._update.bind(this));
    this.iresize = states.subscribe('resize', this._resize.bind(this));
  }

  /**
   * @param {HTMLElement} target
   * @param {import('./trigger.js').TRIGGER_OPTIONS} options
   */
  add(target, options = {}) {
    options.channel = this.states.name;
    options.dir = this.dir;
    return new Trigger(target, options);
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
          if (offsetS <= coords.dimensions && offsetE >= coords.padding) {
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
      this.heights = childs.map((child) => {
        const padding = this.isYaxis ? child.offsetTop : child.offsetLeft;
        const dimensions = this.isYaxis
          ? child.offsetHeight
          : child.offsetWidth;
        return [child, { padding, dimensions: padding + dimensions }];
      });
    }

    const dimensions = this.isYaxis ? 'h' : 'w';
    this.screen = win.screen[dimensions];
    this.height = this.coords[dimensions] - (this.infinite ? 0 : this.screen);
  }
}
