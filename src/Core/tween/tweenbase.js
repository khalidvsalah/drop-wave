import { ease } from '../../Math/ease';
import { clamp } from '../../Math/math';

import { prepare } from '../../Utils/props/prepare';
import { raf } from '../../Utils/raf/raf';
import { toString } from '../../Utils/methods/object';

import { late } from '../late/late';

// each htmlelement or object has a tween base class
export default class TweenBase {
  constructor(element, options) {
    this.prepare = new prepare(element);

    this.props = [];
    this.queue = [];

    this.calls = -1;
    this.progress = 0;
    this.elapsed = 0;

    this.push('p', options);
  }

  update(time) {
    this.running = true;
    this.elapsed = clamp(0, 1, this.progress + time);

    this.tweened.forEach(({ setValue, cb }) => {
      setValue(cb(this.easing(Math.abs(this.dir - this.elapsed))));
    });

    if (this.onUpdate) this.onUpdate(to, this.properties.target);
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

    if (next.props) {
      this.dur = next.dur || 0.5;
      this.props = next.props;
      this.tweened = this.prepare.props(next.props);
      this.progress = 0;
      this.easing = ease(next.ease || 'l');
    } else this.progress = 1 - this.elapsed; // if reverse progress = 1 - time passed

    this.id = raf.push({ cb: this.update.bind(this), d: this.dur });
  }

  check() {
    const next = this.queue[this.calls];

    if (toString(this.props) === toString(next.props)) {
      next.props = undefined;
    } else {
      // new values
      if (this.mode !== next.mode || !this.running) {
        this.late = new late({
          cb: this.execute.bind(this, next),
          d: next.late || 0
        });
        this.late.play();
      }
      //  else if (typeof next.props === 'undefined' && !this.running) {
      //   this.late = new late({
      //     cb: this.execute.bind(this, next),
      //     d: next.late
      //   });
      //   this.late.play();
      // } else if (typeof next.props === 'object') {
      //   this.late = new late({
      //     cb: this.execute.bind(this, next),
      //     d: next.late
      //   });
      //   this.late.play();
      // }
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
      ease: options.ease,
      props: options.props,
      mode
    });

    this.check();
  }

  pause() {}

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
