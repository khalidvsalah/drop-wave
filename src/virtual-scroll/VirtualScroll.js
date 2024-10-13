import { win } from '../methods/window.js';
import { css } from '../methods/css.js';
import { bounds } from '../methods/coordinate.js';
import { clamp, damp } from '../math/math.js';

import Events from './Events.js';
import Trigger from './Trigger.js';

const translateElement = (element, value, isVertical) => {
  if (isVertical) {
    css.set(element, 'transform', `translate3d(0, ${value}px, 0)`);
  } else {
    css.set(element, 'transform', `translate3d(${value}px, 0, 0)`);
  }
};
const inRange = (start, end, coords, kid, isVertical, l) => {
  if (start <= coords.dimensions && end >= coords.padding) {
    translateElement(kid, -l, isVertical);
    coords.out = false;
  } else {
    if (!coords.out) {
      translateElement(kid, -l, isVertical);
      coords.out = true;
    }
  }
};

export class VirtualScroll extends Events {
  #isVertical = false;

  /**
   * @param {HTMLElement} target
   * @param {SCROLL_OPTIONS} [options]
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

    this.dir = dir === 'x' ? 'x' : 'y';
    this.#isVertical = this.dir === 'y';
    this.axis = this.#isVertical ? 'pageY' : 'pageX';

    this.init({ drag, wheel, key, name });

    this.speed = speed;
    this.onUpdate = options.onUpdate;
    this.infinite = options.infinite;

    this._resize();
  }

  /**
   * @param {HTMLElement} target
   * @param {TRIGGER_OPTIONS} [options]
   */
  add(target, options = {}) {
    options.channel = this.observer.name;
    options.dir = this.dir;
    return new Trigger(target, options);
  }

  _update(time) {
    if (!this.infinite) {
      this.scroll.value = clamp(0, this.totalHeight, this.scroll.value);
    }
    this.scroll.lerp = damp(this.scroll.lerp, this.scroll.value, this.speed);

    if (this.infinite) {
      if (this.scroll.lerp > this.totalHeight) {
        this.scroll.value = this.scroll.value - this.totalHeight;
        this.scroll.lerp = this.scroll.lerp - this.totalHeight;
      } else if (this.scroll.lerp < 0) {
        this.scroll.value = this.totalHeight + this.scroll.value;
        this.scroll.lerp = this.totalHeight + this.scroll.lerp;
      }

      this.heights.map(([kid, coords]) => {
        const start = this.scroll.lerp;
        const end = start + this.viewportSize;
        if (this.scroll.lerp > this.totalHeight - this.viewportSize) {
          const offsetS =
            this.scroll.lerp -
            (this.totalHeight - this.viewportSize) -
            this.viewportSize;
          const offsetE = offsetS + this.viewportSize;
          if (offsetS <= coords.dimensions && offsetE >= coords.padding) {
            translateElement(
              kid,
              this.viewportSize - offsetE,
              this.#isVertical
            );
          } else {
            inRange(
              start,
              end,
              coords,
              kid,
              this.#isVertical,
              this.scroll.lerp
            );
          }
        } else {
          inRange(start, end, coords, kid, this.#isVertical, this.scroll.lerp);
        }
      });
    } else translateElement(this.target, -this.scroll.lerp, this.#isVertical);

    this.observer.notify(this.scroll);
    if (this.onUpdate) this.onUpdate(time, this.scroll);
  }

  _resize() {
    this.coords = bounds(this.target);

    if (this.infinite) {
      const children = [...this.target.children];
      this.elementHeights = children.map((child) => {
        const padding = this.#isVertical ? child.offsetTop : child.offsetLeft;
        const dimensions = this.#isVertical
          ? child.offsetHeight
          : child.offsetWidth;
        return [child, { padding, dimensions: padding + dimensions }];
      });
    }

    const dimensions = this.#isVertical ? 'h' : 'w';
    this.viewportSize = win.screen[dimensions];
    this.totalHeight =
      this.coords[dimensions] - (this.infinite ? 0 : this.viewportSize);
  }
}
