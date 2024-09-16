import { ease } from '../../Math/ease';
import { clamp } from '../../Math/math';

import { Prepare } from '../../Utils/props/prepare';
import { raf } from '../../Utils/raf/raf';
import { toString } from '../../Utils/methods/object';

import { Late } from '../../Utils/late/late';

export default class TweenBase {
  constructor(element, options) {
    this.prepare = new Prepare(element);

    this.props = [];
    this.queue = [];
    this.tweened = [];

    this.calls = -1;
    this.progress = 0;
    this.elapsed = 0;

    this.push('p', options);
  }

  update(time) {
    this.running = true;
    this.elapsed = clamp(0, 1, this.progress + time);

    const raf = this.ease(Math.abs(this.dir - this.elapsed));

    this.tweened.forEach(({ setValue, cb }) => {
      setValue(cb(raf));
    });

    if (this.onUpdate) this.onUpdate(raf, this.prepare.target);
    if (this.elapsed === 1) this.done();
  }

  execute(next) {
    if (this.running) this.done();

    this.dir = next.mode === 'r' ? 1 : 0;
    this.mode = next.mode;

    if (this.onStart) {
      this.onStart(this.prepare.target);
      this.onStart = null;
    }

    this.props = next.props;

    if (next.props) {
      this.dur = next.dur || 0.5;
      this.easing = next.ease || 'l';

      this.tweened = this.prepare.init(next.props);
      this.progress = 0;
    } else {
      this.progress = 1 - this.elapsed;
    }

    this.ease = ease(this.easing);
    if (this.tweened.length) {
      this.id = raf.push({ cb: this.update.bind(this), d: this.dur });
    }
  }

  check() {
    const next = this.queue[this.calls];

    if (toString(this.props) === toString(next.props)) {
      next.props = undefined;
    } else {
      if (this.late) {
        this.late.destroy();
      }
      this.late = new Late({
        cb: this.execute.bind(this, next),
        d: next.late || 0,
      });
      this.late.play();
    }
  }

  push(mode, options = {}) {
    ++this.calls;

    this.onStart = options.onStart;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    this.queue.push({
      dur: options.dur, // raf
      late: options.late, // late
      space: options.space,
      ease: options.ease,
      props: options.props,
      mode,
    });

    this.check();
  }

  stop() {
    this.running = false;
    raf.kill(this.id);
  }

  done() {
    this.stop();
    if (this.onComplete) {
      this.onComplete(this.prepare.target);
      this.onComplete = null;
      this.onUpdate = null;
    }
  }
}
