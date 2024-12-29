import { observer } from '../utils/Observer';

import selector from '../helpers/selector.js';

import { win } from '../methods/window.js';
import { offset } from '../methods/coordinate.js';

import { clamp, damp } from '../math/math.js';

import { Events } from './Events.js';
import { Trigger } from './Trigger.js';

import { CSSTransform, inRange, SCROLLS_STORAGE } from './utils/helpers.js';

export class VirtualScroll {
  /**
   * @param {DOMSelector} target
   * @param {scrollOptionsType} [options]
   */
  constructor(target, options = {}) {
    const {
      // main options
      wrapper = document,
      dir = 'y',
      // scroll options
      drag = true,
      wheel = true,
      key = true,
      // easing options
      ease = 0.09,
      // multiplier options
      multiplier = 1,
      // infinite options
      infinite = false,
    } = options;

    if (!target) {
      throw new Error('Please pass a targeted element');
    }

    this.target = selector(target)[0];

    this.isY = dir === 'y';
    options.isY = this.isY;

    this.ease = ease;

    this.multiplier = multiplier;
    this.infinite = infinite;

    this.observer = {
      update: observer.create(Symbol('update')),
      resize: observer.create(Symbol('resize')),
    };

    SCROLLS_STORAGE.set(this.target, {
      observer: {
        update: this.observer.update.name,
        resize: this.observer.resize.name,
      },
      dir,
    });

    this.events = new Events({
      drag,
      wheel,
      key,
      wrapper,
      pause: this.pause,
      multiplier: this.multiplier,
      isY: this.isY,
      resize: this.#_onResize.bind(this),
      update: this.#_onUpdate.bind(this),
    });
    window.history.scrollRestoration = 'manual';
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

  pause() {
    this.events.pause = true;
  }

  resume() {
    this.events.pause = false;
  }

  #_onUpdate() {
    if (!this.events.pause) {
      if (!this.infinite) {
        this.events.scroll.value = clamp(
          0,
          this.height,
          this.events.scroll.value
        );
      }

      this.events.scroll.lerp =
        ((damp(this.events.scroll.lerp, this.events.scroll.value, this.ease) *
          1000) >>
          0) /
        1000;

      if (this.infinite) {
        if (this.events.scroll.lerp > this.height) {
          this.events.scroll.value = this.events.scroll.value - this.height;
          this.events.scroll.lerp = this.events.scroll.lerp - this.height;
        } else if (this.events.scroll.lerp < 0) {
          this.events.scroll.value = this.height + this.events.scroll.value;
          this.events.scroll.lerp = this.height + this.events.scroll.lerp;
        }
        const topBar = this.events.scroll.lerp;
        const bottomBar = this.events.scroll.lerp + this.viewportSize;

        this.childrenSize.forEach(([child, coords]) => {
          if (this.events.scroll.lerp > this.height - this.viewportSize) {
            const offsetStart =
              this.events.scroll.lerp -
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
                this.events.scroll.lerp,
                this.isY
              );
            }
          } else {
            inRange(
              child,
              { topBar, bottomBar },
              coords,
              this.events.scroll.lerp,
              this.isY
            );
          }
        });
      } else {
        CSSTransform(this.target, -this.events.scroll.lerp, this.isY);
      }

      this.observer.update.notify(this.events.scroll);
    }
  }

  #_onResize() {
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

  destroy() {
    this.events.destroy();
    this.observer.resize.remove();
    this.observer.update.remove();
  }
}
