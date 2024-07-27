import { states } from '../../Utils/states/states';
import { choke } from '../../Utils/methods/choke';
import { query } from '../../Utils/methods/query';
import { win } from '../../Utils/methods/window';
import { setProp } from '../../Utils/methods/css';

// import { bounds } from '../../Utils/methods/coordinate';
// import { clamp, damp } from '../../Math/math';

// import Trigger from './tools/trigger';

// const form = (e, p, x, y) =>
//   (e.style.transform = `translate3d(${x + p},${y + p},0)`);

// /**
//  * @param {HTMLElement} dom
//  * @param {number} value
//  * @param {boolean} isY
//  */
// const isYDir = (dom, value, isY) => {
//   if (isY) form(dom, 'px', 0, value);
//   else form(dom, 'px', value, 0);
// };

// /**
//  * @param {number} start
//  * @param {number} end
//  * @param {object} bs
//  * @param {HTMLElement} kid
//  * @param {boolean} isY
//  * @param {number} l
//  */
// const inRange = (start, end, bs, kid, isY, l) => {
//   if (start <= bs.z && end >= bs.a) {
//     isYDir(kid, -l, isY);
//     bs.out = false;
//   } else {
//     if (!bs.out) {
//       isYDir(kid, -l, isY);
//       bs.out = true;
//     }
//   }
// };

// export class scroll extends events {
//   /**
//    * @param {HTMLElement|Window} attacher - eventTarget
//    * @param {object} o - properties
//    */
//   constructor(attacher, o) {
//     super(attacher, o);

//     this.infinite = o.infinite;
//     this.ease = o.ease || 0.09;

//     this.speed = {
//       time: performance.now(),
//       offset: 0,
//       value: 0,
//       ease: o.speed || 0.3
//     };

//     this._resize();
//     this.iraf = states.subscribe('raf', this._raf.bind(this));
//   }

//   /**
//    * Scroll Trigger
//    *
//    * @param {HTMLElement} target - eventTarget
//    * @param {object} o - properties
//    * @returns {object}
//    */
//   add(target, o) {
//     o.obsname = this.states.name;
//     o.dir = this.dir;
//     return new Trigger(target, o);
//   }

//   /**
//    * Loop
//    *
//    * @param {number} t - eventTarget
//    */
//   _raf(t) {
//     if (!this.infinite)
//       this.scroll.value = clamp(0, this.dim, this.scroll.value);
//     this.scroll.lerp = damp(this.scroll.lerp, this.scroll.value, this.ease);

//     this.speed.time = t - this.speed.time;
//     this.speed.offset = this.scroll.lerp - this.speed.offset;
//     this.speed.value = damp(
//       this.speed.value,
//       this.speed.offset / this.speed.time,
//       this.speed.ease
//     );

//     if (this.infinite) {
//       if (this.scroll.lerp > this.dim) {
//         this.scroll.value = this.scroll.value - this.dim;
//         this.scroll.lerp = this.scroll.lerp - this.dim;
//       } else if (this.scroll.lerp < 0) {
//         this.scroll.value = this.dim + this.scroll.value;
//         this.scroll.lerp = this.dim + this.scroll.lerp;
//       }

//       this.infinite.map(([kid, bs]) => {
//         const start = this.scroll.lerp;
//         const end = start + this.screen;

//         if (this.scroll.lerp > this.dim - this.screen) {
//           const offsetS =
//             this.scroll.lerp - (this.dim - this.screen) - this.screen;
//           const offsetE = offsetS + this.screen;

//           if (offsetS <= bs.z && offsetE >= bs.a)
//             isYDir(kid, this.screen - offsetE, this.isY);
//           else inRange(start, end, bs, kid, this.isY, this.scroll.lerp);
//         } else inRange(start, end, bs, kid, this.isY, this.scroll.lerp);
//       });
//     } else isYDir(this.target, -this.scroll.lerp, this.isY);

//     this.speed.time = t;
//     this.speed.offset = this.scroll.lerp;

//     this.states.cb(this.scroll);
//   }

//   /**
//    * event: window on resize
//    */
//   _resize() {
//     this.bs = bounds(this.target);

//     if (this.infinite) {
//       const childs = [...this.target.children];
//       this.infinite = childs.map(kid => {
//         const a = this.isY ? kid.offsetTop : kid.offsetLeft;
//         const z = this.isY ? kid.offsetHeight : kid.offsetWidth;
//         return [kid, { a, z: a + z }];
//       });
//     }

//     const d = this.isY ? 'h' : 'w';
//     this.screen = win.screen[d];

//     this.dim = this.bs[d] - (this.infinite ? 0 : this.screen);
//   }
// }

// pin:{start:string, end:string}

/**
 * Scroll options
 * @typedef {{
 * name:string
 * container:object
 * wheel:boolean,
 * key:boolean,
 * drag:boolean,
 * dir:string,
 * speed:number,
 * infinite:boolean,
 * onUpdate:Function,
 * }} SCROLL_OPTIONS
 */

class events {
  init({ drag, key, wheel }) {
    if (Object.is(this.container, window)) {
      this.global = true;

      if (drag) {
        this.ipointerdown = states.subscribe(
          'pointerdown',
          this._down.bind(this)
        );
        this.ipointermove = states.subscribe(
          'pointermove',
          this._move.bind(this)
        );
      }
      if (key) {
        this.ikey = states.subscribe('keydown', this._onkey.bind(this));
      }
      if (wheel) {
        this.iwheel = states.subscribe('wheel', this._wheel.bind(this));
      }
    } else {
      if (wheel) {
        this.target.onwheel = this._wheel.bind(this);
      }
      if (drag) {
        this.target.onpointerdown = this._down.bind(this);
        this.target.onpointermove = this._move.bind(this);
      }
    }

    this.overlay = query.node('div');
    win.body.appendChild(this.overlay);

    this.overlay.id = 'overlay';
    this.overlay.style.cssText = `
      position: absolute; z-index: 999;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
    `;

    this.choke = new choke({
      d: 0.3,
      cb: () => {
        setProp.pointer(this.overlay, 'none');
      }
    });

    this.dist = 0;
    this.scroll = { value: 0, lerp: 0, dir: 1 };
  }

  _wheel(e) {
    let multip = e.deltaMode === 1 ? 0.83 : 0.55;
    let offset = e.wheelDeltaY * multip;

    this.scroll.value -= offset;
    this.scroll.dir = Math.sign(offset);
  }

  _onkey(e) {
    if (e.key === 'Tab') e.preventDefault();
    else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        let offset = 0;
        if (e.keyCode === 40) offset = -66.6;
        else if (e.keyCode === 38) offset = 66.6;

        this.scroll.value -= offset;
      }
    }
  }

  _down(e) {
    this.mousedown = true;
    this.dist = e[this.pageDir];
  }

  _move(e) {
    if (this.mousedown) {
      let offset = e[this.pageDir] - this.dist;
      this.scroll.value -= offset;
      this.dist = e[this.pageDir];
      this.scroll.dir = Math.sign(offset);

      if (this.global) setProp.pointer(this.overlay, 'all');
    }
  }

  _up() {
    this.mousedown = false;
    this.choke.run();
  }

  _destroy() {
    this.iraf.remove();
    this.iresize.remove();

    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.remove();
        this.ipointermove.remove();
      }

      if (this.ikey) this.ikey.remove();
      if (this.iwheel) this.iwheel.remove();
    } else {
      if (this.target.onwheel) {
        this.target.onwheel = null;
      }

      if (this.target.onpointerdown) {
        this.target.onpointerdown = null;
        this.target.onpointermove = null;
      }
    }

    this.ipointerup.remove();
    this.states.remove();
  }
}

export class scroll extends events {
  /**
   * @param {HTMLElement} target
   * @param {SCROLL_OPTIONS} options
   */
  constructor(target, options = {}) {
    if (typeof target === 'string') {
      throw new Error('Pass <HTMLElement>');
    }

    super();

    const {
      name = Symbol(),
      container = window,
      dir = 'y',
      drag = true,
      wheel = true,
      key = true,
      speed = 0.09,
      infinite = false
    } = options;

    this.target = target;
    this.container = container;
    this.states = states.create(name);

    this.dir = dir === 'x' ? 'x' : 'y';
    this.isYaxis = this.dir === 'y';
    this.vertical = this.isYaxis ? 'pageY' : 'pageX';

    this.init({ drag, wheel, key });

    // this._resize();
    // this.iupdate = states.subscribe('raf', this._update.bind(this));
  }

  _update(time) {}
  _resize() {}
}
