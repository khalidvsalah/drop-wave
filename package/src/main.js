/* @khalidvsalah | blinkwave | v0.0.1 | MIT License | https://github.com/khalidvsalah/blink-wave */ // src/Math/ease.js
var ease = {
  /**
   * Easing functions specify the rate of change of a parameter over time.
   *
   * @link   https://easings.net/
   * @param {number} t - (Time \ Rate).
   * @returns {number} The Eased Value.
   */
  l: (t) => t,
  i1: (x) => 1 - Math.cos(x * Math.PI / 2),
  o1: (x) => Math.sin(x * Math.PI / 2),
  io1: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  i2: (x) => Math.pow(x, 2),
  o2: (x) => 1 - (1 - x) * (1 - x),
  io2: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
  i3: (x) => Math.pow(x, 3),
  o3: (x) => 1 - Math.pow(1 - x, 3),
  io3: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  i4: (x) => Math.pow(x, 4),
  o4: (x) => 1 - Math.pow(1 - x, 4),
  io4: (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  i5: (x) => Math.pow(x, 5),
  o5: (x) => 1 - Math.pow(1 - x, 5),
  io5: (x) => x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2,
  i6: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
  o6: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  io6: (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  i7: (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  o7: (x) => sqrt(1 - Math.pow(x - 1, 2)),
  io7: (x) => x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
};
var ease_default = ease;

// src/Math/math.js
var zero = (min, a) => Math.max(min, a);
var clamp = (min, max, a) => Math.min(Math.max(min, a), max);
var lerp = (x, y, a) => (1 - a) * x + a * y;
var map = (a, b, x) => clamp(0, 1, (x - a) / (b - a));
var remap = (x, y, c, d3, a) => map(x, y, a) * (d3 - c) + c;
var round = (num, pow) => {
  const d3 = pow ? Math.pow(10, pow) : 100;
  return Math.round(num * d3) / d3;
};

// src/Core/methods/methods.js
var has = (e, p) => window.hasOwnProperty.call(e, p);
var bounds = (e) => {
  let rect = e.getBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
    x: rect.x,
    y: rect.y,
    xE: rect.right,
    yE: rect.bottom
  };
};
var computed = (c) => window.getComputedStyle(c);
var iSet = {
  alpha: (e, v) => e.style.opacity = v,
  display: (e, v) => e.style.display = v,
  pointer: (e, v) => e.style.pointerEvents = v,
  id: (s) => document.getElementById(s),
  el: (s) => document.querySelector(s),
  els: (s) => [...document.querySelectorAll(s)],
  sEl: (e, s) => e.querySelector(s),
  sEls: (e, s) => [...e.querySelectorAll(s)],
  get size() {
    return { w: window.innerWidth, h: window.innerHeight };
  },
  position: (e, v) => e.style.position = v,
  node: (type) => document.createElement(type),
  text: (text) => document.createTextNode(text),
  string: (obj2) => JSON.stringify(obj2),
  visible: (e, v) => e.style.visibility = v
};
var choke = class {
  constructor({ late, cb }) {
    this.late = late * 1e3;
    this.cb = cb;
    this.time = 0;
  }
  run() {
    clearTimeout(this.time);
    this.time = setTimeout(this.cb, this.late);
  }
};

// src/Utils/properties/alpha.js
var alpha = (o, n) => {
  const oV = {
    s: +n.opacity,
    e: o[0]
  };
  oV.lerp = oV.e - oV.s;
  return (e) => `${oV.s + oV.lerp * e}`;
};
var setValue = (e, v) => e.style.opacity = v;
var alpha_default = {
  cb: alpha,
  setValue
};

// src/Utils/properties/d.js
var length = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
};
var segment = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
function parseValues(args) {
  const numbers = args.match(number);
  return numbers ? numbers.map(Number) : [];
}
function parse(path) {
  const data = [];
  path.replace(segment, function(_, command, args) {
    let type = command.toLowerCase();
    args = parseValues(args);
    if (type === "m" && args.length > 2) {
      data.push([command].concat(args.splice(0, 2)));
      type = "l";
      command = command === "m" ? "l" : "L";
    }
    while (true) {
      if (args.length === length[type]) {
        args.unshift(command);
        return data.push(args);
      }
      if (args.length < length[type])
        throw new Error("malformed path data");
      data.push([command].concat(args.splice(0, length[type])));
    }
  });
  return data;
}
var d = (p, n) => {
  const s = parse(n.el.getAttribute("d"));
  const e = parse(p[0]);
  return (t) => {
    let st = "";
    let value = "";
    for (let i = 0; i < s.length; i++) {
      const i1 = s[i];
      const i2 = e[i];
      for (let k = 0; k < i1.length; k++) {
        st += (isNaN(i1[k]) ? i1[k] : lerp(i1[k], i2[k], t)) + " ";
      }
      value = st.trim();
    }
    return value;
  };
};
var setValue2 = (e, v) => e.setAttribute("d", v);
var d_default = {
  cb: d,
  setValue: setValue2
};

// src/Utils/properties/dash.js
var dash = (d3, n) => {
  const dV = {
    s: parseFloat(n.strokeDashoffset),
    e: d3[0]
  };
  dV.lerp = dV.e - dV.s;
  return (e) => `${dV.s + dV.lerp * e}`;
};
var setValue3 = (e, v) => e.style.strokeDashoffset = v;
var dash_default = {
  cb: dash,
  setValue: setValue3
};

// src/Utils/properties/points.js
var d2 = (t) => {
  const r = [];
  const arr = t.split(" ");
  const length2 = arr.length;
  for (let t2 = 0; t2 < length2; t2++) {
    const i = arr[t2].split(",");
    const a = i.length;
    for (let t3 = 0; t3 < a; t3++) {
      const n = i[t3];
      r.push(isNaN(n) ? n : +n);
    }
  }
  return r;
};
var points = (p, n) => {
  const s = d2(n.el.getAttribute("points"));
  const e = d2(p[0]);
  return (t) => {
    let st = "";
    let value = "";
    for (let i = 0; i < s.length; i++) {
      st += lerp(s[i], e[i], t) + " ";
      value = st.trim();
    }
    return value;
  };
};
var setValue4 = (e, v) => e.setAttribute("points", v);
var points_default = {
  cb: points,
  setValue: setValue4
};

// src/Utils/properties/top.js
var top = (t, c) => {
  let tV;
  if (c.top === "auto") {
    tV = {
      s: 0,
      e: t[0],
      unit: t[1] || "px"
    };
  } else {
    const tC = parseFloat(c.top);
    tV = {
      s: t[1] === "px" ? tC : tC / bounds(c.pa).h * 100,
      e: t[0],
      unit: t[1] || "px"
    };
  }
  tV.lerp = tV.e - tV.s;
  return (e) => `${tV.s + tV.lerp * e}${tV.unit}`;
};
var setValue5 = (e, v) => e.style.top = v;
var top_default = {
  cb: top,
  setValue: setValue5
};

// src/Utils/properties/transform.js
var translateX = (p, t, w) => {
  const x = p.x;
  const value = t ? +t[4] : 0;
  let xV;
  if (t) {
    xV = {
      s: x ? x[1] === "px" ? value : value / parseFloat(w) * 100 : value,
      e: x ? x[0] : value
    };
  } else {
    xV = {
      s: 0,
      e: x ? x[0] : 0
    };
  }
  xV.lerp = xV.e - xV.s;
  xV.unit = x ? x[1] ? x[1] : "px" : "px";
  return xV;
};
var translateY = (p, t, h) => {
  const y = p.y;
  const value = t ? +t[5] : 0;
  let yV;
  if (t) {
    yV = {
      s: y ? y[1] === "px" ? value : value / parseFloat(h) * 100 : value,
      e: y ? y[0] : value
    };
  } else {
    yV = {
      s: 0,
      e: y ? y[0] : 0
    };
  }
  yV.lerp = yV.e - yV.s;
  yV.unit = y ? y[1] ? y[1] : "px" : "px";
  return yV;
};
var scaleX = (p, t) => {
  const sx = p.sx;
  let sxV;
  if (t)
    sxV = { s: +t[0], e: sx ? sx[0] : +t[0] };
  else
    sxV = { s: 1, e: sx ? sx[0] : 1 };
  sxV.lerp = sxV.e - sxV.s;
  return sxV;
};
var scaleY = (p, t) => {
  const sy = p.sy;
  let syV;
  if (t)
    syV = { s: +t[3], e: sy ? sy[0] : +t[3] };
  else
    syV = { s: 1, e: sy ? sy[0] : 1 };
  syV.lerp = syV.e - syV.s;
  return syV;
};
var rotateX = (p) => {
  const rx = p.rx;
  const rxV = {
    s: rx ? rx[0] : 0,
    e: rx ? rx[1] : 0
  };
  rxV.lerp = rxV.e - rxV.s;
  return rxV;
};
var rotateY = (p) => {
  const ry = p.ry;
  const ryV = {
    s: ry ? ry[0] : 0,
    e: ry ? ry[1] : 0
  };
  ryV.lerp = ryV.e - ryV.s;
  return ryV;
};
var getMatrix = (t) => {
  const matrix3D = t.match(/^matrix3d\((.+)\)$/);
  let matrix = t.match(/\((.+)\)$/);
  if (matrix3D) {
    matrix = matrix3D[1].split(", ");
    matrix = [
      matrix[0],
      matrix[1],
      matrix[4],
      matrix[5],
      matrix[12],
      matrix[13]
    ];
  } else if (matrix) {
    matrix = matrix[1].split(", ");
  }
  return matrix;
};
var transform = (p, { transform: transform2, width: width2, height: height2 }) => {
  const matrix = getMatrix(transform2);
  const xV = translateX(p, matrix, width2);
  const yV = translateY(p, matrix, height2);
  const sxV = scaleX(p, matrix);
  const syV = scaleY(p, matrix);
  const rxV = rotateX(p, matrix);
  const ryV = rotateY(p, matrix);
  return (e) => {
    const eX = `${xV.s + xV.lerp * e}${xV.unit}`;
    const eY = `${yV.s + yV.lerp * e}${yV.unit}`;
    const eSX = `${sxV.s + sxV.lerp * e}`;
    const eSY = `${syV.s + syV.lerp * e}`;
    const eRX = `${rxV.s + rxV.lerp * e}deg`;
    const eRY = `${ryV.s + ryV.lerp * e}deg`;
    return `translate3d(${eX}, ${eY}, 0) scale(${eSX}, ${eSY}) rotateX(${eRX}) rotateY(${eRY})`;
  };
};
var setValue6 = (e, v) => e.style.transform = v;
var transform_default = {
  cb: transform,
  setValue: setValue6
};

// src/Utils/properties/blur.js
var blur = (b, c) => {
  let bV;
  if (c.filter === "none") {
    bV = {
      s: 0,
      e: b[0]
    };
  } else {
    bV = {
      s: +c.filter.match(/(\d.*)px/)[1],
      e: b[0]
    };
  }
  bV.lerp = bV.e - bV.s;
  return (e) => bV.s + bV.lerp * e;
};
var setValue7 = (e, v) => e.style.filter = `blur(${v}px)`;
var blur_default = {
  cb: blur,
  setValue: setValue7
};

// src/Utils/properties/width.js
var width = (w, n) => {
  const parse2 = parseFloat(n.width);
  const wV = {
    s: w[1] === "px" ? parse2 : parse2 / n.pa.clientWidth * 100,
    e: w[0],
    unit: w[1] === "px" ? "px" : "%"
  };
  wV.lerp = wV.e - wV.s;
  return (e) => `${wV.s + wV.lerp * e}${wV.unit}`;
};
var setValue8 = (e, v) => e.style.width = v;
var width_default = {
  cb: width,
  setValue: setValue8
};

// src/Utils/properties/height.js
var height = (h, n) => {
  const parse2 = parseFloat(n.height);
  const hV = {
    s: h[1] === "px" ? parse2 : parse2 / n.pa.clientHeight * 100,
    e: h[0],
    unit: h[1] === "px" ? "px" : "%"
  };
  hV.lerp = hV.e - hV.s;
  return (e) => `${hV.s + hV.lerp * e}${hV.unit}`;
};
var setValue9 = (e, v) => e.style.height = v;
var height_default = {
  cb: height,
  setValue: setValue9
};

// src/Utils/props.js
function match(name) {
  if (name.match(/^(form)$/))
    return transform_default;
  else if (name.match(/^(a)$/))
    return alpha_default;
  else if (name.match(/^(dash)$/))
    return dash_default;
  else if (name.match(/^(points)$/))
    return points_default;
  else if (name.match(/^(d)$/))
    return d_default;
  else if (name.match(/^(t)$/))
    return top_default;
  else if (name.match(/^(blur)$/))
    return blur_default;
  else if (name.match(/^(width)$/))
    return width_default;
  else if (name.match(/^(height)$/))
    return height_default;
}
function dom(e, ps) {
  const results = [];
  const c = computed(e);
  const dir = ps.dir == -1 ? true : false;
  const easef = ease_default[ps.ease || "l"];
  c.el = e;
  c.pa = e.parentNode;
  for (const key of Object.entries(ps)) {
    if (key[0] == "dir")
      continue;
    if (key[0] == "ease")
      continue;
    const values = match(key[0]);
    const cb = values.cb(key[1], c);
    let easing = key[1][key[1].length - 1];
    if (easing == void 0)
      easing = ease_default[key[1].ease];
    else
      easing = ease_default[easing.ease];
    easing = easing || easef;
    results.push({
      setV: values.setValue,
      cb: (e2) => cb(easing(dir ? 1 - e2 : e2))
    });
  }
  if (dir)
    results.map(({ setV, cb }) => setV(e, cb(0)));
  return results;
}
function obj(e, ps) {
  const results = [];
  for (const key in ps) {
    const pV = { s: e[key] };
    pV.lerp = ps[key][0] - pV.s;
    results.push({
      setV: (e2, v) => e2[key] = v,
      cb: (e2) => pV.s + pV.lerp * e2
    });
  }
  return results;
}
function props(e, o, ps) {
  if (!o)
    return dom(e, ps);
  else
    return obj(e, ps);
}
var props_default = props;

// src/Utils/raf.js
var Raf = class {
  constructor() {
    this.items = [];
    this.on = false;
    this.id = -1;
  }
  /**
   * Push Objects.
   * @param {{cb: Function, d: number}} o
   * @returns {Number} - object id.
   */
  push(o) {
    if (o.d === 0)
      return o.cb(1);
    o.id = ++this.id;
    this.items.push(o);
    if (!this.on)
      this.loop();
    return o.id;
  }
  update(t) {
    for (let i = 0; i < this.items.length; i++) {
      const o = this.items[i];
      if (o.d) {
        if (!o.st)
          o.st = t;
        const time = (t - o.st) / (o.d * 1e3);
        const e = clamp(0, 1, time);
        const cb = o.cb(e);
        if (cb || e === 1)
          this.kill(o.id);
      } else
        o.cb(t);
    }
    this.loop();
  }
  /**
   * Remove object from items.
   * @param {Number} - object id.
   */
  kill(n) {
    this.items.map((o, i) => {
      if (o.id === n) {
        o.id = null;
        o.st = null;
        this.items.splice(i, 1);
      }
    });
  }
  loop() {
    if (this.items.length === 0) {
      this.on = false;
      window.cancelAnimationFrame(this.raf);
    } else {
      this.on = true;
      this.raf = window.requestAnimationFrame(this.update.bind(this));
    }
  }
};
var raf_default = new Raf();

// src/Utils/helpers/scrub.js
function scrub(cb) {
  const node = document.createElement("section");
  const lProg = { start: 0, end: 0, lerp: 0.75 };
  node.style.cssText = ` position: fixed; height: 32px; width: 32px; display: flex; align-items: center; justify-content: center; font-size: 12px; background: #333; color: #fff; border-radius: 50%; pointer-events: none; `;
  observer_default.add("pointermove", (e) => {
    const progress = round(e.pageX / iSet.size.w);
    node.style.top = e.pageY + -30 + "px";
    node.style.left = e.pageX + -30 * progress + "px";
    node.textContent = progress;
    lProg.start = clamp(0, 0.99999, progress);
  });
  observer_default.add("raf", () => {
    lProg.end = lerp(lProg.start, lProg.end, lProg.lerp);
    cb(lProg.end);
  });
  document.body.appendChild(node);
}

// src/Core/late/late.js
var Late = class {
  /**
   * @param {{late: Number, o: Object, cb: Function}}
   */
  constructor({ late, o, cb }) {
    this.d = late || 0;
    this.o = o;
    this.cb = cb;
    this.on = false;
    this.stop = false;
  }
  /**
   * Push to the Raf.
   */
  play() {
    this.on = true;
    this.stop = false;
    if (this.d == 0) {
      this.Elp();
    } else {
      this.id = raf_default.push({ cb: this.loop.bind(this) });
      this.f = performance.now() + this.d * 1e3;
    }
  }
  destroy() {
    this.stop = true;
    this.on = false;
  }
  loop(t) {
    if (t > this.f) {
      raf_default.kill(this.id);
      this.Elp();
    }
  }
  /**
   * On compeletion.
   */
  Elp() {
    if (this.stop)
      return;
    this.on = false;
    raf_default.push(this.o);
    this.cb && this.cb();
  }
};

// src/Core/tween/tools/targeted.js
function element(ele) {
  this.obj = false;
  if (ele instanceof Node) {
    this.target = ele;
  } else if (typeof ele == "string") {
    this.target = iSet.el(ele);
  } else {
    this.obj = true;
    this.target = ele;
  }
}

// src/Core/tween/tools/stored.js
var store = /* @__PURE__ */ new Map();
function stored(node) {
  let stored2 = store.get(node);
  if (stored2) {
    return stored2;
  } else {
    store.set(node, this);
    return false;
  }
}

// src/Core/tween/tween.js
var Tween = class {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   */
  constructor(el, o) {
    const sT = stored.call(this, el);
    if (!sT) {
      element.call(this, el);
      this.init(o);
    } else {
      return sT;
    }
  }
  /**
   * Setting up the class.
   */
  init(o) {
    this.o = o;
    this.gui = o.gui;
    this.mode;
    this.prog = 0;
    this.elpased = 0;
    this.dir = 0;
    this.d = o.d;
    this.late = o.late;
    this.props = o.p;
    this.props.ease = o.ease || "l";
    this.lateO = { cb: this.run.bind(this), d: this.d };
    this.late = new Late({ late: this.late, o: this.lateO });
    this.properties = props_default(this.target, this.obj, this.props);
  }
  /**
   * Loop.
   * @param {Number} t - elapsed time.
   */
  run(t) {
    this.on = true;
    this.rest = this.prog + t;
    this.elpased = clamp(0, 1, this.rest);
    this.e = Math.abs(this.dir - this.elpased);
    this.properties.map(({ setV, cb }) => setV(this.target, cb(this.e)));
    this.raf && this.raf(this.e, this.target);
    if (this.elpased === 1)
      return this.destroy();
  }
  /**
   * Controaling animation (forward, reversed).
   * @param {String} m - the mode.
   * @param {Boolean} n - check if the properties has changed.
   *
   */
  control(mode, n) {
    if (this.late.on && this.mode !== mode) {
      this.mode = mode;
      this.late.destroy();
    }
    if (this.mode === mode)
      return;
    this.mode = mode;
    if (mode === "r")
      this.dir = 1;
    else
      this.dir = 0;
    this.late.cb = () => {
      if (this.start)
        this.start(this.target);
    };
    if (this.late.on)
      return;
    if (this.on) {
      this.lateO.st = null;
      if (n)
        this.prog = 0;
      else
        this.prog = 1 - this.elpased;
    } else {
      this.late.play();
    }
  }
  /**
   * @param {number} d - update delay time.
   *
   */
  reverse(o) {
    this.late.d = o.late || this.late.d;
    if (this.index === 0) {
      this.start = o.start;
      this.completed = o.completed;
      this.raf = o.raf;
    }
    this.control("r");
  }
  /**
   * (Checkt/Update) properties object
   *
   * @param {Object} o - The new properties.
   */
  play(o, i) {
    if (this.gui) {
      scrub(this.run.bind(this));
      return;
    }
    this.index = i;
    if (this.index === 0) {
      this.start = o.start;
      this.completed = o.completed;
      this.raf = o.raf;
    }
    if (iSet.string(this.props) !== iSet.string(o.p)) {
      this.late.d = o.late || 0;
      this.lateO.d = o.d;
      this.props = o.p;
      this.props.ease = this.o.ease || this.props.ease;
      this.properties = props_default(this.target, this.obj, this.props);
      this.mode = "r";
      this.control("p", true);
    } else {
      this.control("p");
    }
  }
  destroy() {
    this.on = false;
    this.prog = 0;
    if (this.completed)
      this.completed(this.target);
    return true;
  }
};
var tween_default = Tween;

// src/Core/tween/index.js
function Interface(els, o) {
  let nodes;
  if (els instanceof NodeList || Array.isArray(els))
    nodes = [...els];
  else
    nodes = [els];
  const tweens = nodes.map((node, i) => {
    let late = (o.late || 0) + (o.space * i || 0);
    return new tween_default(node, { ...o, late });
  });
  tweens.map((tw, i) => tw.play(o, i));
  let lates = tweens.map((tw) => tw.late.d);
  return {
    reverse: (obj2 = {}) => {
      let late = (o.late || 0) - obj2.late;
      tweens.map((tw, i) => {
        obj2.late = lates[i] - late;
        tw.reverse(obj2);
      });
    },
    play: () => tweens.map((tw, i) => tw.play(o, i))
  };
}
var tween_default2 = Interface;

// src/Core/methods/observer.js
var Observer = class {
  constructor() {
    this.observers = {};
  }
  /**
   * @param {String} name - observer name
   */
  obs(name) {
    this.observers[name] = { items: [], id: 0 };
    function callItem() {
      let target = this[name];
      let args = Array.prototype.slice.call(arguments);
      for (let i = 0; i < target.items.length; i++) {
        target.items[i].cb(...args);
      }
    }
    let r = (name2) => {
      this.observers[name2].items = [];
    };
    return {
      cb: callItem.bind(this.observers),
      name,
      r: r.bind(this, name)
    };
  }
  /**
   * @param {String} name - observer name
   * @param {Function} cb - callback function
   */
  add(name, cb) {
    if (!this.observers[name])
      console.error(name);
    let items = this.observers[name].items;
    let id = this.observers[name].id++;
    let obj2 = { cb, id, on: true };
    items.push(obj2);
    let r = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == o.id) {
          items[i].on = false;
          items.splice(i, 1);
        }
      }
    };
    return {
      item: obj2,
      r: r.bind({}, obj2)
    };
  }
  /**
   * @param {String} name - observer name
   */
  check(name) {
    return this.observers[name] ? true : false;
  }
};
var observer_default = new Observer();

// src/Core/scroll/trigger.js
var match2 = (str, bs) => {
  let plus = str.match(/(\+|\-)(.*)/);
  if (plus) {
    if (plus[1] == "+")
      return bs + +plus[2];
    else if (plus[1] == "-")
      return bs - +plus[2];
  } else
    return +str;
};
var trigger = class {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   * @param {String} subname - Loop name
   * @param {Object} dir - scolling direction
   */
  constructor(el, o, dir) {
    this.el = el;
    this.o = o;
    this.dir = dir;
    this.d = dir ? "y" : "x";
    this.dE = dir ? "yE" : "xE";
    this.Init(o);
  }
  Init(o) {
    if (!o.target) {
      o.target = this.el;
      this.target = o.target;
    }
    if (o.scroll) {
      const node = o.target.length ? o.target[0] : o.target;
      this.ps = props_default(node, false, o.scroll);
      this.ease = ease_default[o.ease || "l"];
    }
    if (o.pin) {
      this.pin = o.pin;
      this.pin.target = o.pin.target || this.target;
    }
    this.iresize = observer_default.add("resize", this.resize.bind(this));
    this.resize();
    this.iraf = observer_default.add(o.obsname, this.raf.bind(this));
  }
  /**
   * resize
   */
  resize() {
    const bs = bounds(this.target.length ? this.target[0] : this.target);
    if (this.dir) {
      this.sp = match2(this.o.start || "+0", bs.y);
      this.ep = match2(this.o.end || "+0", bs.yE);
      if (this.o.pin) {
        this.pin.start = match2(this.pin.a || "+0", bs.y);
        this.pin.end = match2(this.pin.z || "+0", bs.yE);
      }
    } else {
      this.sp = match2(this.o.start || "+0", bs.x);
      this.ep = match2(this.o.end || "+0", bs.xE);
      if (this.o.pin) {
        this.pin.start = match2(this.pin.a || "+0", bs.x);
        this.pin.end = match2(this.pin.z || "+0", bs.xE);
      }
    }
  }
  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord[this.d];
    let s = this.sp;
    let e = this.ep;
    if (this.o.scroll) {
      if (e < this.coord || s > this.coord)
        this.in = false;
      if (s <= this.coord)
        this.in = true;
      const dist = map(s, e, this.coord);
      if (this.in)
        this.scroll(dist);
      if (this.o.pin)
        this.piner();
      if (this.o.raf)
        this.o.raf(this.o.target, this.coord);
    } else if (s <= this.coord)
      this.fire();
  }
  /**
   * Animate with scrolling
   */
  scroll(t) {
    this.ps.map((p) => {
      if (this.o.target.length) {
        this.o.target.forEach((el) => p.setV(el, p.cb(this.ease(t))));
      } else {
        p.setV(this.o.target, p.cb(this.ease(t)));
      }
    });
  }
  /**
   * If passed fire
   */
  fire() {
    if (this.o.tween)
      tween_default2(this.target, this.o.tween);
    if (this.o.completed)
      this.o.completed(this.target);
    this.destroy();
  }
  /**
   * Pin Function
   */
  piner() {
    if (this.pined) {
      if (!(this.coord >= this.pin.end)) {
        const dist = zero(0, this.coord - this.pin.pxS);
        this.pin.target.style.transform = `translate3d(${this.dir ? "0px," + dist + "px" : dist + "px,0px"},0px)`;
      }
    }
    if (this.coord < this.pin.start)
      this.pined = false;
    else if (this.coord >= this.pin.start && !this.pined) {
      this.pin.pxS = this.coord;
      this.pined = true;
    }
  }
  /**
   * remove events
   */
  destroy() {
    this.iraf.r();
    this.iresize.r();
  }
};
var trigger_default = trigger;

// src/Core/scroll/scroll.js
var Scroll = class {
  /**
   * @param {HTMLElement|Window} attacher - the parent
   * @param {Object} o - properties
   */
  constructor(attacher, o) {
    history.scrollRestoration = "manual";
    this.attacher = attacher;
    this.target = o.target;
    this.ease = o.ease || 0.09;
    this.dir = o.dir ? o.dir : "y";
    this.ePage = this.dir == "y" ? "pageY" : "pageX";
    this.o = o;
    this.Init(o);
    this.sub = observer_default.obs(o.obs || Symbol("foo"));
    this.time = (/* @__PURE__ */ new Date()).getTime();
    this.offset = 0;
    this.chokeEl = iSet.el("[overlay]");
    this.choke = new choke({
      late: 0.3,
      cb: () => iSet.pointer(this.chokeEl, "none")
    });
  }
  /**
   * Initializing the virtial scrolling class
   */
  Init(o) {
    if (this.attacher == window) {
      if (o.drag !== false) {
        this.ipointerdown = observer_default.add("pointerdown", this.down.bind(this));
        this.ipointermove = observer_default.add("pointermove", this.move.bind(this));
      }
      if (o.key !== false)
        this.ikey = observer_default.add("keydown", this.key.bind(this));
      if (o.wheel !== false)
        this.iwheel = observer_default.add("wheel", this.wheel.bind(this));
    } else {
      if (o.drag !== false) {
        this.attacher.onpointerdown = this.down.bind(this);
        this.attacher.onpointermove = this.move.bind(this);
      }
      if (o.wheel !== false)
        this.attacher.onwheel = this.wheel.bind(this);
    }
    this.ipointerup = observer_default.add("pointerup", this.up.bind(this));
    this.iresize = observer_default.add("resize", this.resize.bind(this));
    this.drag = { x: 0, y: 0 };
    this.prev = { x: 0, y: 0 };
    this.scroll = { x: 0, y: 0 };
    this.dist = {
      x: { start: 0, end: 0 },
      y: { start: 0, end: 0 }
    };
  }
  /**
   * Run on scolling
   */
  begin() {
    if (!this.iraf || !this.iraf.item.on) {
      this.iraf = observer_default.add("raf", this.raf.bind(this));
    }
  }
  /**
   * Handling wheel event
   */
  wheel(e) {
    this.begin();
    let multip = e.deltaMode == 1 ? 0.83 : 0.55;
    this.time = e.timeStamp - this.time;
    this.offset = this.drag[this.dir];
    this.drag[this.dir] -= e.wheelDeltaY * multip;
    const offset = this.drag[this.dir] - this.offset;
    this.scroll.sp = Math.abs(offset / this.time);
    this.scroll.dir = Math.sign(offset);
    this.time = e.timeStamp;
  }
  /**
   * Starting point
   */
  down(e) {
    iSet.pointer(this.chokeEl, "all");
    this.downOn = true;
    this.dist[this.dir].start = e[this.ePage];
    this.prev[this.dir] = this.drag[this.dir];
  }
  /**
   * drag / mouse-moveing
   */
  move(e) {
    if (this.downOn) {
      this.begin();
      this.time = e.timeStamp - this.time;
      this.offset = this.drag[this.dir];
      this.drag[this.dir] += -(e[this.ePage] - this.dist[this.dir].start);
      this.dist[this.dir].start = e[this.ePage];
      const offset = this.drag[this.dir] - this.offset;
      this.scroll.sp = Math.abs(offset / this.time);
      this.scroll.dir = Math.sign(offset);
      this.time = e.timeStamp;
    }
  }
  key(e) {
    if (e.keyCode == 40 || e.keyCode == 38) {
      this.begin();
      let offset = 0;
      if (e.keyCode == 40)
        offset = -66.6;
      else if (e.keyCode == 38)
        offset = 66.6;
      this.drag[this.dir] -= offset;
    }
  }
  /**
   * End point
   */
  up() {
    this.downOn = false;
    this.choke.run();
  }
  /**
   * Add Trigger
   */
  add(target, o) {
    o.obsname = this.sub.name;
    const trigger2 = new trigger_default(target, o, this.dir);
    this.begin();
    return trigger2;
  }
  raf() {
    this.drag[this.dir] = clamp(
      0,
      this.pageSize < 0 ? 0 : this.pageSize,
      this.drag[this.dir]
    );
    this.scroll[this.dir] = lerp(
      this.scroll[this.dir],
      this.drag[this.dir],
      this.ease
    );
    this.target.style.transform = `translate3d(-${this.scroll.x}px, -${this.scroll.y}px, 0)`;
    if (this.sub)
      this.sub.cb(this.scroll);
    if (round(this.scroll[this.dir], 2) == this.drag[this.dir])
      this.iraf.r();
  }
  resize() {
    this.bs = bounds(this.target);
    const size = iSet.size;
    if (this.dir == "y")
      this.pageSize = this.bs.h - size.h;
    else
      this.pageSize = this.bs.w - size.w;
  }
  /**
   * Remove events
   */
  destroy() {
    if (this.iraf)
      this.iraf.r();
    if (this.sub)
      this.sub.r();
    if (this.attacher === window) {
      if (this.ipointerdown) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }
      if (this.ikey)
        this.ikey.r();
      if (this.iwheel)
        this.iwheel.r();
    } else {
      if (this.o.drag !== false) {
        this.attacher.onpointerdown = null;
        this.attacher.onpointermove = null;
      }
      if (this.o.wheel)
        this.attacher.onwheel = null;
    }
    this.ipointerup.r();
    this.iresize.r();
  }
};
var scroll_default = Scroll;
export {
  bounds,
  choke,
  clamp,
  computed,
  ease_default as ease,
  has,
  iSet,
  Late as late,
  lerp,
  map,
  props_default as props,
  raf_default as raf,
  remap,
  round,
  scroll_default as scroll,
  scrub,
  observer_default as sub,
  tween_default2 as tween,
  zero
};
