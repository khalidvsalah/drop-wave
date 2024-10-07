import { ease } from '../../Math/ease';
import { clamp } from '../../Math/math';

import { prepare } from '../../Utils/props/prepare';
import { raf } from '../../Utils/raf/raf';

import { Delay } from '../../Utils/delay/delay';

/**
 * Tween Base Class
 * For each element, a new instance is created.
 *
 * @class
 */
export default class TweenBase {
  /**
   *
   * @param {HTMLElement} element
   * @param {import('../../types/tweenTypes').TWEEN_OPTIONS} options
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
    this.properties.forEach(({ setValue, cb }) => setValue(cb(easedValue)));

    if (this.onUpdate) this.onUpdate(easedValue, this.element);
    if (this.elapsed === 1) this.done();
  }

  execute(nextTween) {
    if (this.isRunning) this.done();

    this.dir = nextTween.mode === 'reverse' ? 1 : 0;
    this.mode = nextTween.mode;

    if (this.onStart) {
      this.onStart(this.element);
      this.onStart = null;
    }

    if (nextTween.props) {
      this.duration = nextTween.duration;
      this.easingType = nextTween.ease;

      this.properties = prepare(this.element, nextTween.props);
      this.progress = 0;
    } else {
      this.progress = 1 - this.elapsed;
    }

    this.ease = ease(this.easingType);
    if (this.properties.length) {
      this.animationId = raf.push({
        cb: this.update.bind(this),
        d: this.duration,
      });
    }
  }

  /**
   *
   * @param {string} mode
   * @param {import('../../types/tweenTypes').TWEEN_OPTIONS} options
   */
  push(mode, options = {}) {
    ++this.callIndex;

    this.onStart = options.onStart;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    this.queue.push({
      duration: options.duration,
      delay: options.delay,
      space: options.space,
      ease: options.ease,
      props: options.props,
      mode,
    });

    const nextTween = this.queue[this.callIndex];
    this.delay = new Delay({
      cb: this.execute.bind(this, nextTween),
      d: nextTween.delay,
    });
    this.delay.play();
  }

  stop() {
    this.isRunning = false;
    raf.kill(this.animationId);
  }

  done() {
    this.stop();
    if (this.onComplete) {
      this.onComplete(this.element);
      this.onComplete = null;
      this.onUpdate = null;
    }
  }
}
