import { easingFn } from '../../math/easing/index';
import { clamp } from '../../math/math';

import { raf } from '../../utils/Raf';
import { Delay } from '../../utils/Delay';

import { prepareTween } from './helpers';

export default class TweenBase {
  #elapsed = 0;
  #queue = [];
  #callIndex = -1;

  /**
   * Tween Controller
   *
   * @param {HTMLElement} element
   * @param {tweenOptionsType} options
   */
  constructor(element, options) {
    this.element = element;
    this.properties = [];
    this.progress = 0;
    this.push('play', options);
  }

  update(time) {
    this.isRunning = true;
    this.#elapsed = clamp(0, 1, this.progress + time);

    const easedValue = this.ease(Math.abs(this.dir - this.#elapsed));
    this.properties.forEach(({ tween }) => tween(easedValue));

    if (this.onUpdate) this.onUpdate(this.element, easedValue);
    if (this.#elapsed === 1) this._done();
  }

  fire() {
    this.animationId = raf.push({
      cb: this.update.bind(this),
      d: this.duration,
    });
  }

  execute(nextTween) {
    this.onStart = nextTween.onStart;
    this.onUpdate = nextTween.onUpdate;
    this.onComplete = nextTween.onComplete;

    if (nextTween.to || nextTween.from) {
      if (this.onStart) {
        this.onStart(this.element);
        this.onStart = null;
      }

      this.duration = nextTween.duration;
      this.ease = easingFn[nextTween.ease];

      this.properties = prepareTween(this.element, nextTween);
      this.progress = 0;

      this.fire();
    } else {
      this.dir = nextTween.mode === 'reverse' ? 1 : 0;
      if (nextTween.mode !== this.mode) {
        if (this.isRunning) this._done();
        this.fire();
        this.progress = 1 - this.#elapsed;
      }
    }

    this.mode = nextTween.mode;
  }

  /**
   * @param {string} mode
   * @param {tweenOptionsType} options
   */
  push(mode, options = {}) {
    ++this.#callIndex;

    const nextTween = { mode, ...options };
    this.#queue.push(nextTween);

    this.delay = new Delay({
      cb: this.execute.bind(this, nextTween),
      d: nextTween.delay,
    });
    this.delay.play();
  }

  _stop() {
    raf.kill(this.animationId);
    this.isRunning = false;
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
