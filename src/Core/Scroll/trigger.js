import { states } from '../../Utils/states/states';
import { Prepare } from '../../Utils/props/prepare';
import { offset } from '../../Utils/methods/coordinate';
import { setProp } from '../../Utils/methods/css';

import { tween } from '../tween/tween';
import { map } from '../../Math/math';

/**
 * This function handles the (start\end) of
 * the triggered element
 * ("+number") => add padding to the element (top\bottom) position
 * (number\"number") (start\end) in the exact pixel position
 *
 * @param {string|number} str
 * @param {number} coord
 * @param {number} size
 */
const match = (str = '0', coord, size) => {
  if (typeof str === 'number') {
    return str;
  }

  const match = /^([+|-]\d+)(%|px)?/.exec(str);

  if (match) {
    const percentage = match[2] === '%';
    return coord + (percentage ? (+match[1] * size) / 100 : +match[1]);
  } else {
    return +str;
  }
};

export class Trigger {
  constructor(target, options) {
    this.target = target;
    this.options = options;

    this.pin = options.pin;
    this.scroll = options.scroll;
    this.animate = options.animate;
    this.tween = this.scroll ? false : options.tween;
    this.onUpdate = options.onUpdate;

    this.dir = options.dir;
    this.isYaxis = options.dir === 'y';
    this.size = this.isYaxis ? 'h' : 'w';
    this.dirEnd = this.dir === 'y' ? 'yE' : 'xE';

    this.pined = false;
    this.prepare = [];

    if (target.length) {
      target.forEach(element => {
        this.prepare.push(new Prepare(element));
      });
    } else {
      this.prepare.push(new Prepare(target));
    }

    this.init(options);
  }

  init(options) {
    if (this.tween || this.scroll) {
      this.start = options.start;
      this.end = options.end;

      if (this.animate) {
        this.preparies = this.prepare.map(element => {
          return element.init(this.animate)[0];
        });
      }
    }

    this._resize();
    this.iupdate = states.subscribe(options.channel, this._update.bind(this));
    this.iresize = states.subscribe('resize', this._resize.bind(this));
  }

  _scroll(elapsed) {
    this.preparies.forEach(prepare => {
      prepare.setValue(prepare.cb(elapsed));
    });
  }

  _fire() {
    if (this.tween) {
      tween(this.target, this.tween);
    }
    this._destroy();
  }

  _pin() {
    if (this.pined) {
      if (!(this.coord >= this.pinEnd)) {
        const dist = Math.max(0, this.coord - this.pin.scroll);
        if (this.isYaxis) {
          setProp.transform(this.target, `translate3d(0, ${dist}px, 0)`);
        } else {
          setProp.transform(this.target, `translate3d(${dist}px, 0, 0)`);
        }
      }
    }
    if (this.coord < this.pinStart) {
      this.pined = false;
    } else if (this.coord >= this.pinStart && !this.pined) {
      this.pin.scroll = this.coord;
      this.pined = true;
    }
  }

  _update({ lerp }) {
    this.coord = lerp;
    const elapsed = map(this.startPoint, this.endPoint, this.coord);
    if (this.pin) {
      this._pin();
    }
    if (this.scroll) {
      this._scroll(elapsed);
    }
    if (this.tween) {
      if (this.startPoint <= this.coord) {
        this._fire();
      }
    }
    if (this.onUpdate) this.onUpdate(elapsed, this.target);
  }

  _resize() {
    const coords = offset(this.target);

    if (this.tween || this.scroll) {
      this.startPoint = match(this.start, coords[this.dir], coords[this.size]);
      this.endPoint = match(this.end, coords[this.dirEnd], coords[this.size]);
    }

    if (this.pin) {
      this.pinStart = match(
        this.pin.start,
        coords[this.dir],
        coords[this.size]
      );
      this.pinEnd = match(this.pin.end, coords[this.dirEnd], coords[this.size]);
    }
  }

  _destroy() {
    this.iresize.remove();
    this.iupdate.remove();
  }
}
