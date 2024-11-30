import { easingFn } from '../../math/easing/index';
import { clamp } from '../../math/math';

import { processing } from '../../processing/processing';

import { raf } from '../../utils/Raf';
import { Delay } from '../../utils/Delay';
import { computed } from '../../methods/computed';

export default class TweenBase {
  /**
   * Tween Controller
   *
   * @param {HTMLElement} element
   * @param {tweenOptionsType} options
   */
  constructor(element, options) {
    this.element = element;

    this.queue = [];
    this.properties = [];

    this.callIndex = -1;
    this.progress = 0;
    this.elapsed = 0;

    this.push('play', options);
  }

  update(time) {
    this.isRunning = true;
    this.elapsed = clamp(0, 1, this.progress + time);

    const easedValue = this.ease(Math.abs(this.dir - this.elapsed));
    this.properties.forEach(({ tween }) => tween(easedValue));

    if (this.onUpdate) this.onUpdate(easedValue, this.element);
    if (this.elapsed === 1) this._done();
  }

  fire() {
    this.animationId = raf.push({
      cb: this.update.bind(this),
      d: this.duration,
    });
  }

  execute(nextTween) {
    let from = nextTween.from;
    let to = nextTween.to;

    if (to || from) {
      if (this.isRunning) this._done();
      this.dir = 0;

      if (this.onStart) {
        this.onStart(this.element);
        this.onStart = null;
      }

      this.duration = nextTween.duration;
      this.ease = easingFn[nextTween.ease];

      if (to) {
        from = from || computed(this.element);
      } else if (from) {
        if (!to) {
          const computedStyle = computed(this.element);
          to = {};
          Object.keys(from).map((key) => {
            to[key] = computedStyle[key];
          });
        }
      }

      this.properties = processing(this.element, from, to);
      this.progress = 0;

      this.fire();
    } else {
      this.dir = nextTween.mode === 'reverse' ? 1 : 0;
      if (nextTween.mode !== this.mode) {
        if (this.isRunning) this._done();
        this.fire();
        this.progress = 1 - this.elapsed;
      }
    }

    this.mode = nextTween.mode;
  }

  /**
   * @param {string} mode
   * @param {tweenOptionsType} options
   */
  push(mode, options = {}) {
    ++this.callIndex;

    this.onStart = options.onStart;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    const nextTween = { mode, ...options };
    this.queue.push(nextTween);

    this.delay = new Delay({
      cb: this.execute.bind(this, nextTween),
      d: nextTween.delay,
    });
    this.delay.play();
  }

  _stop() {
    this.isRunning = false;
    raf.kill(this.animationId);
  }

  _done() {
    this._stop();
    if (this.onComplete) {
      this.onComplete(this.element);
      this.onComplete = null;
      this.onUpdate = null;
    }
  }
}
