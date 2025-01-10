import { raf } from '../../utils/Raf';

import { toPixels } from '../../helpers/handleUnits';
import selector from '../../helpers/selector';

import { offset } from '../../methods/coordinate';
import { debounce } from '../../methods/debounce';
import { computed } from '../../methods/computed';

import { clamp, normalize, inRange, lerp, round } from '../../math/math';
import { easingFn } from '../../math/easing/index';

import { tween } from '../tween/tween';
import { prepareTween } from '../tween/helpers';

import { parseTransform } from '../../components/transform/transform';

const pinOut = (eles, values) => {
  eles.forEach((ele) => {
    ele.style.cssText = `
      transform: translate(${values.translate.x}px, ${values.translate.y}px) scale(${values.scale.x}, ${values.scale.y});
      inset: 0px auto auto 0px;
      position: static;
    `;
  });
};

export class Trigger {
  #targets;

  #properties = [];

  #pinObj;
  #animateObj;
  #tweenObj;

  #dir;
  #ease;
  #isY;
  #dim;
  #dirEnd;
  #scrollDir;

  #isOut = true;

  #pinOut = true;
  #pinStart;
  #pinEnd;

  #updateId;
  #updateOn = false;

  #onEnter;
  #onLeave;
  #onEnterBack;
  #onLeaveBack;

  #onUpdate;

  /**
   * @param {DOMSelector} trigger
   * @param {triggerOptionsType} options
   */
  constructor(trigger, options) {
    this.trigger = selector(trigger)[0];
    this.options = options;

    this.#targets = options.target ? selector(options.target) : [this.trigger];

    this.#pinObj = options.pin;
    this.#animateObj = options.animate;
    this.#tweenObj = options.tween;

    this.#dir = options.dir ? options.dir : 'y';
    this.#isY = this.#dir === 'y';

    this.#dim = this.#isY ? 'h' : 'w';
    this.#dirEnd = this.#isY ? 'yE' : 'xE';
    this.#scrollDir = this.#isY ? 'scrollY' : 'scrollX';

    this.#onEnter = options.onEnter;
    this.#onLeave = options.onLeave;
    this.#onEnterBack = options.onEnterBack;
    this.#onLeaveBack = options.onLeaveBack;
    this.#onUpdate = options.onUpdate;

    // scroll
    this.preScroll = 0;
    this.scroll = 0;

    this.#init();
  }

  #init() {
    if (this.#animateObj) {
      this.#ease = easingFn[this.#animateObj.ease];
      this.#targets.forEach((element) => {
        this.#properties.push(prepareTween(element, this.#animateObj));
      });
    }

    // resize - update
    this.#_resize();
    this.debounce = debounce({ cb: this.#_resize.bind(this), time: 0.15 });
    this.pushRef = () => {
      if (!this.#updateOn) {
        this.#updateId = raf.push({ cb: this.#_update.bind(this), d: -1 });
      }
    };

    window.addEventListener('scroll', this.pushRef);
    window.addEventListener('resize', this.debounce);

    // pin - setup
    if (this.#pinObj) {
      this.computeds = this.#targets.map((ele) => computed(ele));
      this.#targets.forEach((ele, idx) => {
        const { margin, width, height } = this.computeds[idx];
        const placeHolder = document.createElement('div');
        placeHolder.style.cssText = `
            position: relative;
            overflow: visiable;
            box-sizing: border-box;
            padding: 0;
            margin: ${margin};
            width: ${width};
            height: ${height};
        `;
        ele.insertAdjacentElement('beforebegin', placeHolder);
        placeHolder.appendChild(ele);
      });
    }
  }

  #_animate(elapsed) {
    this.#properties.map((propertie) => {
      propertie.forEach(({ tween }) => tween(this.#ease(elapsed)));
    });
  }

  #_tween() {
    this.isTweened = true;
    tween(this.#targets, this.#tweenObj);
  }

  #_pin() {
    if (this.scroll < this.#pinStart && !this.#pinOut) {
      this.#pinOut = true;
      pinOut(this.#targets, this.tSartV);
    } else if (
      inRange(this.#pinStart, this.#pinEnd, this.scroll) &&
      this.#pinOut
    ) {
      const dist = this.coords[this.#dir] - this.#pinStart;
      this.#targets.forEach((element, idx) => {
        const { width, height, transform } = this.computeds[idx];
        if (!this.tSartV) {
          this.tSartV = parseTransform(transform);
        }
        element.style.cssText = `
          transform: translate(${this.tSartV.translate.x}px, ${this.tSartV.translate.y}px) scale(${this.tSartV.scale.x}, ${this.tSartV.scale.y});
          left: ${this.#isY ? element.offsetLeft : dist}px;
          top: ${this.#isY ? dist : element.offsetTop}px;
          position: fixed;
          margin: 0;
          max-width: ${width};
          max-height: ${height};
        `;
      });
      this.#pinOut = false;
    } else if (this.scroll > this.#pinEnd && !this.#pinOut) {
      this.#pinOut = true;
      const dist = this.#pinEnd - this.coords[this.#dir];
      pinOut(this.#targets, {
        ...this.tSartV,
        translate: {
          x: (this.#isY ? 0 : dist) + this.tSartV.translate.x,
          y: (this.#isY ? dist : 0) + this.tSartV.translate.y,
        },
      });
    }
  }

  #_update() {
    this.preScroll = round(lerp(this.preScroll, this.scroll, 0.85), 4);
    this.scroll = window[this.#scrollDir];

    this.preElapsed = this.elapsed;
    this.elapsed = clamp(0, 1, normalize(this.start, this.end, this.scroll));

    if (this.#pinObj) {
      this.#_pin();
    }
    if (this.#animateObj) {
      this.#_animate(this.elapsed);
    }
    if (this.#tweenObj) {
      if (this.start <= this.scroll && !this.isTweened) {
        this.#_tween();
      }
    }

    if (!this.#isOut) {
      if (this.elapsed === 1) {
        if (this.#onLeave) {
          this.#onLeave();
        }
      }
      if (this.elapsed === 0) {
        if (this.#onLeaveBack) {
          this.#onLeaveBack();
        }
      }
    }

    if (this.preScroll === this.scroll) {
      raf.kill(this.#updateId);
      this.#updateOn = false;
    } else {
      this.#updateOn = true;
    }

    if (inRange(0, 1, this.elapsed)) {
      this.#isOut = false;
    } else {
      this.#isOut = true;
    }

    if (!this.#isOut) {
      if (this.preElapsed === 0) {
        if (this.#onEnter) {
          this.#onEnter();
        }
      }
      if (this.preElapsed === 1) {
        if (this.#onEnterBack) {
          this.#onEnterBack();
        }
      }
    }

    if (this.#onUpdate) {
      this.#onUpdate({
        progress: this.elapsed,
        target: this.#targets,
        trigger: this.trigger,
      });
    }
  }

  #_resize() {
    // this.#pinOut = false;
    this.coords = offset(this.trigger);

    const start =
      typeof this.options.start === 'function'
        ? this.options.start(this.coords)
        : this.coords[this.#dir] +
          toPixels(this.options.start || '0', this.coords[this.#dim]).pixels;
    const end =
      typeof this.options.end === 'function'
        ? this.options.end(this.coords)
        : this.coords[this.#dirEnd] +
          toPixels(this.options.end || '0', this.coords[this.#dim]).pixels;

    this.start = start;
    this.end = end;

    if (this.#pinObj) {
      const start =
        typeof this.#pinObj.start === 'function'
          ? this.#pinObj.start(this.coords)
          : this.coords[this.#dir] +
            toPixels(this.#pinObj.start || '0', this.coords[this.#dim]).pixels;
      const end =
        typeof this.#pinObj.end === 'function'
          ? this.#pinObj.end(this.coords)
          : this.coords[this.#dirEnd] +
            toPixels(this.#pinObj.end || '0', this.coords[this.#dim]).pixels;

      this.#pinStart = start;
      this.#pinEnd = end;
    }
  }

  destroy() {
    if (this.#updateOn) raf.kill(this.#updateId);
    window.removeEventListener('resize', this.debounce);
    window.removeEventListener('scroll', this.pushRef);
  }
}
