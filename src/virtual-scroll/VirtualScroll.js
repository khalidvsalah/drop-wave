import { observer } from '../utils/Observer';

import selector from '../helpers/selector.js';

import { win } from '../methods/window.js';
import { offset } from '../methods/coordinate.js';

import { clamp, damp, lerp } from '../math/math.js';

import { Events } from './Events.js';
import { Trigger } from './Trigger.js';

import { CSSTransform, inRange, SCROLLS_STORAGE } from './utils/helpers.js';

export class VirtualScroll extends Events {
  /**
   * @param {HTMLElement} target
   * @param {scrollOptionsType} [options]
   */
  constructor(target, options = {}) {
    super();

    if (!options.name) {
      throw new Error('Please pass a unique name for this scroll');
    }

    const {
      // main
      name,
      wrapper = window,
      dir = 'y',
      // inputs
      drag = true,
      wheel = true,
      key = true,
      // easing
      ease = 0.09,
      lerpFn = 'damp',
      dampEase = 0.50399,
      offset = 1,
      // infinite
      infinite = false,
    } = options;

    this.target = selector(target)[0];
    this.scroll = { value: 0, lerp: 0, dir: 1 };

    this.wrapper = wrapper;

    this.isY = dir === 'y';
    this.axis = this.isY ? 'pageY' : 'pageX';

    this.pause = false;

    this.lerpFn = lerpFn === 'damp' ? damp : lerp;
    this.dampEase = dampEase;
    this.ease = ease;
    this.offset = offset;

    this.infinite = infinite;

    this.observer = {
      update: observer.create('update-' + name),
      resize: observer.create('resize-' + name),
    };

    this.init({ drag, wheel, key });
    this._resize();

    SCROLLS_STORAGE.set(this.target, {
      observer: {
        update: this.observer.update.name,
        resize: this.observer.resize.name,
      },
      dir,
    });
  }

  /**
   * @param {HTMLElement} target
   * @param {triggerOptionsType} options
   */
  add(target, options = {}) {
    options.container = this.target;
    options.isY = this.isY;
    return new Trigger(target, options);
  }

  _update() {
    if (!this.isStopped) {
      if (!this.infinite) {
        this.scroll.value = clamp(0, this.height, this.scroll.value);
      }
      this.scroll.lerp =
        ((this.lerpFn(
          this.scroll.lerp,
          this.scroll.value,
          this.ease,
          this.dampEase
        ) *
          1000) >>
          0) /
        1000;

      if (this.infinite) {
        // switching
        if (this.scroll.lerp > this.height) {
          this.scroll.value = this.scroll.value - this.height;
          this.scroll.lerp = this.scroll.lerp - this.height;
        } else if (this.scroll.lerp < 0) {
          this.scroll.value = this.height + this.scroll.value;
          this.scroll.lerp = this.height + this.scroll.lerp;
        }

        const topBar = this.scroll.lerp; // topBar > End === "out"
        const bottomBar = this.scroll.lerp + this.viewportSize; // bottomBar < start === 'out';

        // transform children
        this.childrenSize.forEach(([child, coords]) => {
          if (this.scroll.lerp > this.height - this.viewportSize) {
            const offsetStart =
              this.scroll.lerp -
              (this.height - this.viewportSize) -
              this.viewportSize;
            const offsetEnd = offsetStart + this.viewportSize;
            if (offsetStart <= coords.end && offsetEnd >= coords.start) {
              CSSTransform(child, this.viewportSize - offsetEnd, this.isY);
            } else {
              inRange(
                child,
                { topBar, bottomBar },
                coords,
                this.scroll.lerp,
                this.isY
              );
            }
          } else {
            inRange(
              child,
              { topBar, bottomBar },
              coords,
              this.scroll.lerp,
              this.isY
            );
          }
        });
      } else {
        CSSTransform(this.target, -this.scroll.lerp, this.isY);
      }
      this.observer.update.notify(this.scroll);
    }
  }

  _resize() {
    const dim = this.isY ? 'h' : 'w';

    this.coords = offset(this.target);
    this.viewportSize = win.screen[dim];
    this.height = this.coords[dim] - (this.infinite ? 0 : this.viewportSize);

    if (this.infinite) {
      this.children = [...this.target.children];

      this.childrenSize = this.children.map((child) => {
        const start = this.isY ? child.offsetTop : child.offsetLeft;
        const size = this.isY ? child.offsetHeight : child.offsetWidth;
        return [child, { start, end: start + size, out: true }];
      });
    }

    this.observer.resize.notify();
  }
}
