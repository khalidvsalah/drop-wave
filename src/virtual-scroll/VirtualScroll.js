import { win } from '../methods/window.js';
import { offset } from '../methods/coordinate.js';
import { clamp, damp } from '../math/math.js';

import Events from './Events.js';
import Trigger from './Trigger.js';

import { CSSTransform, inRange } from './utils/helpers.js';

export class VirtualScroll extends Events {
  #isY = false;

  /**
   * @param {HTMLElement} target
   * @param {scrollOptionsType} [options]
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
      ease = 0.09,
    } = options;

    this.target = target;
    this.container = container;

    this.dir = dir === 'x' ? 'x' : 'y';
    this.#isY = this.dir === 'y';
    this.axis = this.#isY ? 'pageY' : 'pageX';

    this.init({ drag, wheel, key, name });

    this.ease = ease;
    this.infinite = options.infinite;
    this.children = [...this.target.children];

    this._resize();
  }

  /**
   * @param {HTMLElement} target
   * @param {triggerOptionsType} options
   */
  add(target, options = {}) {
    options.channel = this.observer.name;
    options.dir = this.dir;
    return new Trigger(target, options);
  }

  _update() {
    if (!this.infinite) {
      this.scroll.value = clamp(0, this.totalHeight, this.scroll.value);
    }
    this.scroll.lerp = damp(this.scroll.lerp, this.scroll.value, this.ease);

    if (this.infinite) {
      // switching
      if (this.scroll.lerp > this.totalHeight) {
        this.scroll.value = this.scroll.value - this.totalHeight;
        this.scroll.lerp = this.scroll.lerp - this.totalHeight;
      } else if (this.scroll.lerp < 0) {
        this.scroll.value = this.totalHeight + this.scroll.value;
        this.scroll.lerp = this.totalHeight + this.scroll.lerp;
      }

      const topBar = this.scroll.lerp; // topBar > End === "out"
      const bottomBar = this.scroll.lerp + this.viewportSize; // bottomBar < start === 'out';

      // transform children
      this.childrenSize.forEach(([child, coords]) => {
        if (this.scroll.lerp > this.totalHeight - this.viewportSize) {
          const offsetStart =
            this.scroll.lerp -
            (this.totalHeight - this.viewportSize) -
            this.viewportSize;
          const offsetEnd = offsetStart + this.viewportSize;
          if (offsetStart <= coords.end && offsetEnd >= coords.start) {
            CSSTransform(child, this.viewportSize - offsetEnd, this.#isY);
          } else {
            inRange(
              child,
              { topBar, bottomBar },
              coords,
              this.scroll.lerp,
              this.#isY
            );
          }
        } else {
          inRange(
            child,
            { topBar, bottomBar },
            coords,
            this.scroll.lerp,
            this.#isY
          );
        }
      });
    } else {
      CSSTransform(this.target, -this.scroll.lerp, this.#isY);
    }
    this.observer.notify(this.scroll);
  }

  _resize() {
    this.coords = offset(this.target);

    const dim = this.#isY ? 'h' : 'w';
    this.viewportSize = win.screen[dim];
    this.totalHeight =
      this.coords[dim] - (this.infinite ? 0 : this.viewportSize);

    if (this.infinite) {
      this.childrenSize = this.children.map((child) => {
        const start = this.#isY ? child.offsetTop : child.offsetLeft;
        const size = this.#isY ? child.offsetHeight : child.offsetWidth;
        return [child, { start, end: start + size, out: true }];
      });
    }
  }
}
