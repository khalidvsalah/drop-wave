// src/Math/ease.js
var cB0 = (aA1) => 3 * aA1;
var cB1 = (aA1, aA2) => 1 - cB0(aA2) + cB0(aA1);
var cB2 = (aA1, aA2) => cB0(aA2) - 6 * aA1;
var calcBezier = (t, aA1, aA2) => {
  return ((cB1(aA1, aA2) * t + cB2(aA1, aA2)) * t + cB0(aA1)) * t;
};
function getSlope(aT, aA1, aA2) {
  return cB0(cB1(aA1, aA2)) * Math.pow(aT, 2) + 2 * cB2(aA1, aA2) * aT + cB0(aA1);
}
var divide = (aX, aA, aB, mX1, mX2) => {
  let h = 0;
  let a = 0;
  let o = 0;
  do {
    a = aA + (aB - aA) / 2;
    h = calcBezier(a, mX1, mX2) - aX;
    if (h > 0)
      aB = a;
    else
      aA = a;
  } while (Math.abs(h) > 1e-7 && ++o < 10);
  return a;
};
var iterate = (i, e, s, r) => {
  for (let t = 0; t < 4; ++t) {
    const a = getSlope(e, s, r);
    if (a === 0)
      return e;
    e -= (calcBezier(e, s, r) - i) / a;
  }
  return e;
};
var custom = (arr) => {
  let mX1 = arr[0], mY1 = arr[1], mX2 = arr[2], mY2 = arr[3];
  if (mX1 === mY1 && mX2 === mY2)
    return ease2.l;
  const o = new Float32Array(11);
  for (let i = 0; i < 11; ++i) {
    o[i] = calcBezier(i * 0.1, mX1, mX2);
  }
  function getTForX(aX) {
    let intervalStart = 0;
    let currentSample = 1;
    for (; currentSample !== 10 && o[currentSample] <= aX; ++currentSample) {
      intervalStart += 0.1;
    }
    --currentSample;
    const dist2 = (aX - o[currentSample]) / (o[currentSample + 1] - o[currentSample]);
    const guessForT = intervalStart + dist2 * 0.1;
    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= 1e-3)
      return iterate(aX, guessForT, mX1, mX2);
    else if (initialSlope === 0)
      return guessForT;
    else
      return divide(aX, intervalStart, intervalStart + 0.1, mX1, mX2);
  }
  return (x) => {
    if (x === 0 || x === 1)
      return x;
    return calcBezier(getTForX(x), mY1, mY2);
  };
};
var ease2 = {
  /**
   * Easing functions specify the rate of change of a parameter over time.
   *
   * @link   https://easings.net/
   * @param {number} t - (Time \ Rate).
   * @returns {number} The Eased Value.
   */
  custom,
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
var ease_default = (str) => {
  if (typeof str === "object")
    return ease2.custom(str);
  else
    return ease2[str];
};

// src/Math/math.js
var clamp = (min, max, a) => Math.min(Math.max(min, a), max);
var lerp = (x, y, a) => (1 - a) * x + a * y;
var map = (a, b, x) => clamp(0, 1, (x - a) / (b - a));
var remap = (x, y, c, d3, a) => map(x, y, a) * (d3 - c) + c;
var round = (num, pow) => {
  const d3 = pow ? Math.pow(10, pow) : 100;
  return Math.round(num * d3) / d3;
};
var dist = (x, y) => Math.sqrt(x ** 2 + y ** 2);
var damp = (t, s, i, n = 0.50399) => lerp(t, s, 1 - Math.exp(-i * n));

// src/Utils/methods/object.js
var isHas = (e, p) => window.hasOwnProperty.call(e, p);
var toString = (obj2) => JSON.stringify(obj2);

// src/Utils/methods/coordinate.js
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
var offset = (element2) => {
  var width2 = element2.offsetWidth, height2 = element2.offsetHeight, left = element2.offsetLeft, top2 = element2.offsetTop;
  return {
    w: width2,
    h: height2,
    x: left,
    xE: left + width2,
    y: top2,
    yE: top2 + height2
  };
};
var computed = (c) => window.getComputedStyle(c);

// src/Utils/methods/window.js
var win = {
  get screen() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  },
  html: document.html,
  body: document.body
};
var window_default = win;

// src/Utils/methods/css.js
var css = {
  alpha: (e, v) => e.style.opacity = v,
  display: (e, v) => e.style.display = v,
  pointer: (e, v) => e.style.pointerEvents = v,
  position: (e, v) => e.style.position = v,
  visible: (e, v) => e.style.visibility = v,
  form: (e, p, x, y) => e.style.transform = `translate3d(${x + p},${y + p},0)`
};
var css_default = css;

// src/Utils/methods/query.js
var query = {
  id: (s) => document.getElementById(s),
  el: (s) => document.querySelector(s),
  els: (s) => [...document.querySelectorAll(s)],
  sEl: (e, s) => e.querySelector(s),
  sEls: (e, s) => [...e.querySelectorAll(s)],
  node: (type) => document.createElement(type),
  text: (text) => document.createTextNode(text)
};
var query_default = query;

// src/Utils/methods/choke.js
var Choke = class {
  #time = 0;
  constructor({
    d: d3,
    cb
  }) {
    this.d = d3 * 1e3;
    this.cb = cb;
  }
  run() {
    clearTimeout(this.#time);
    this.#time = setTimeout(this.cb, this.d);
  }
};

// src/Utils/props/properties/alpha.js
var alpha = (o, {
  opacity,
  easing
}) => {
  const oV = {
    s: +opacity,
    e: o[0],
    ease: o[1] ? ease_default(o[1]) : easing
  };
  oV.lerp = oV.e - oV.s;
  return (e) => `${oV.s + oV.lerp * oV.ease(e)}`;
};
var setValue = (e, v) => e.style.opacity = v;
var alpha_default = {
  cb: alpha,
  setValue
};

// src/Utils/props/properties/blur.js
var blur = (b, {
  filter: filter2,
  easing
}) => {
  let bV;
  if (filter2 === "none") {
    bV = {
      s: 0,
      e: b[0]
    };
  } else {
    bV = {
      s: +filter2.match(/(\d.*)px/)[1],
      e: b[0]
    };
  }
  bV.lerp = bV.e - bV.s;
  bV.ease = b[1] ? ease_default(b[1]) : easing;
  return (e) => bV.s + bV.lerp * bV.ease(e);
};
var setValue2 = (e, v) => e.style.filter = `blur(${v}px)`;
var blur_default = {
  cb: blur,
  setValue: setValue2
};

// src/Utils/props/properties/d.js
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
var d = (p, {
  el,
  easing
}) => {
  const s = parse(el.getAttribute("d"));
  const e = parse(p[0]);
  const curve = p[1] ? ease_default(p[1]) : easing;
  return (t) => {
    let st = "";
    let value = "";
    for (let i = 0; i < s.length; i++) {
      const i1 = s[i];
      const i2 = e[i];
      for (let k = 0; k < i1.length; k++) {
        st += (isNaN(i1[k]) ? i1[k] : lerp(i1[k], i2[k], curve(t))) + " ";
      }
      value = st.trim();
    }
    return value;
  };
};
var setValue3 = (e, v) => e.setAttribute("d", v);
var d_default = {
  cb: d,
  setValue: setValue3
};

// src/Utils/props/properties/dash.js
var dash = (d3, {
  el,
  easing
}) => {
  const length2 = el.getTotalLength();
  const dV = {
    s: d3[0] * length2,
    e: d3[1] * length2,
    ease: d3[2] ? ease_default(d3[2]) : easing
  };
  dV.lerp = dV.e - dV.s;
  return (e) => `${dV.s + dV.lerp * dV.ease(e)}`;
};
var setValue4 = (e, v) => e.style.strokeDasharray = v;
var dash_default = {
  cb: dash,
  setValue: setValue4
};

// src/Utils/props/properties/draw.js
var dash2 = (d3, {
  el,
  easing
}) => {
  const length2 = el.getTotalLength();
  el.style.strokeDasharray = length2;
  const dV = {
    s: d3[1] * length2,
    e: d3[0] * length2,
    ease: d3[2] ? ease_default(d3[2]) : easing
  };
  dV.lerp = dV.e - dV.s;
  return (e) => `${dV.s + dV.lerp * dV.ease(e)}`;
};
var setValue5 = (e, v) => e.style.strokeDashoffset = v;
var draw_default = {
  cb: dash2,
  setValue: setValue5
};

// src/Utils/props/properties/points.js
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
var points = (p, {
  el,
  easing
}) => {
  const s = d2(el.getAttribute("points"));
  const e = d2(p[0]);
  const curve = p[1] ? ease(p[1]) : easing;
  return (t) => {
    let st = "";
    let value = "";
    for (let i = 0; i < s.length; i++) {
      st += lerp(s[i], e[i], curve(t)) + " ";
      value = st.trim();
    }
    return value;
  };
};
var setValue6 = (e, v) => e.setAttribute("points", v);
var points_default = {
  cb: points,
  setValue: setValue6
};

// src/Utils/props/properties/transform.js
var translate = (x, t, w, easing) => {
  let xV = {
    s: x ? x[1] == "px" ? t : t / parseFloat(w) * 100 : t,
    e: x ? x[0] : t,
    unit: x ? x[1] ? x[1] : "px" : "px"
  };
  xV.lerp = xV.e - xV.s;
  if (x)
    xV.ease = x[2] ? ease_default(x[2]) : easing;
  else
    xV.ease = ease_default("l");
  return (e) => `${xV.s + xV.lerp * xV.ease(e)}${xV.unit}`;
};
var scale = (sx, t, easing) => {
  let sxV = {
    s: t,
    e: sx ? sx[0] : t
  };
  sxV.lerp = sxV.e - sxV.s;
  if (sx)
    sxV.ease = sx[1] ? ease_default(sx[1]) : easing;
  else
    sxV.ease = ease_default("l");
  return (e) => `${sxV.s + sxV.lerp * sxV.ease(e)}`;
};
var rotate = (rx, easing) => {
  const rxV = {
    s: rx ? rx[0] : 0,
    e: rx ? rx[1] : 0
  };
  rxV.lerp = rxV.e - rxV.s;
  if (rx)
    rxV.ease = rx[1] ? ease_default(rx[1]) : easing;
  else
    rxV.ease = ease_default("l");
  return (e) => `${rxV.s + rxV.lerp * rxV.ease(e)}deg`;
};
var getMatrix = (t) => {
  const matrix3D = t.match(/^matrix3d\((.+)\)$/);
  let matrix = t.match(/\((.+)\)$/);
  if (matrix3D) {
    matrix = matrix3D[1].split(", ");
    matrix = [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]];
  } else if (matrix) {
    matrix = matrix[1].split(", ");
  }
  return matrix;
};
var transform = (p, {
  transform: transform2,
  width: width2,
  height: height2,
  easing
}) => {
  const matrix = getMatrix(transform2);
  const xV = translate(p.x, matrix ? +matrix[4] : 0, width2, easing);
  const yV = translate(p.y, matrix ? +matrix[5] : 0, height2, easing);
  const sxV = scale(p.sx, matrix ? +matrix[0] : 1, easing);
  const syV = scale(p.sy, matrix ? +matrix[3] : 1, easing);
  const rxV = rotate(p.rx, easing);
  const ryV = rotate(p.ry, easing);
  return (e) => {
    return `translate3d(${xV(e)}, ${yV(e)}, 0) scale(${sxV(e)}, ${syV(e)}) rotateX(${rxV(e)}) rotateY(${ryV(e)})`;
  };
};
var setValue7 = (e, v) => e.style.transform = v;
var transform_default = {
  cb: transform,
  setValue: setValue7
};

// src/Utils/props/properties/top.js
var top = (t, {
  parent,
  top: top2,
  easing
}) => {
  let tV;
  if (top2 === "auto") {
    tV = {
      s: 0,
      e: t[0],
      unit: t[1] || "px"
    };
  } else {
    const tC = parseFloat(top2);
    tV = {
      s: t[1] === "px" ? tC : tC / bounds(parent).h * 100,
      e: t[0],
      unit: t[1] || "px"
    };
  }
  tV.lerp = tV.e - tV.s;
  tV.ease = t[2] ? ease_default(t[2]) : easing;
  return (e) => `${tV.s + tV.lerp * tV.ease(e)}${tV.unit}`;
};
var setValue8 = (e, v) => e.style.top = v;
var top_default = {
  cb: top,
  setValue: setValue8
};

// src/Utils/props/properties/width.js
var width = (w, {
  parent,
  width: width2,
  easing
}) => {
  const parse2 = parseFloat(width2);
  const wV = {
    s: w[1] === "px" ? parse2 : parse2 / parent.clientWidth * 100,
    e: w[0],
    unit: w[1] === "px" ? "px" : "%",
    ease: w[2] ? ease_default(w[2]) : easing
  };
  wV.lerp = wV.e - wV.s;
  return (e) => `${wV.s + wV.lerp * wV.ease(e)}${wV.unit}`;
};
var setValue9 = (e, v) => e.style.width = v;
var width_default = {
  cb: width,
  setValue: setValue9
};

// src/Utils/props/properties/height.js
var height = (h, {
  parent,
  height: height2,
  easing
}) => {
  const parse2 = parseFloat(height2);
  const hV = {
    s: h[1] === "px" ? parse2 : parse2 / parent.clientHeight * 100,
    e: h[0],
    unit: h[1] === "px" ? "px" : "%",
    ease: h[2] ? ease_default(h[2]) : easing
  };
  hV.lerp = hV.e - hV.s;
  return (e) => `${hV.s + hV.lerp * hV.ease(e)}${hV.unit}`;
};
var setValue10 = (e, v) => e.style.height = v;
var height_default = {
  cb: height,
  setValue: setValue10
};

// src/Utils/props/properties/circle.js
var circle = (c, {
  clipPath,
  easing
}) => {
  const rMatch = clipPath.match(/circle\((.*?) at/);
  const pMath = clipPath.match(/at (.*?)\)/);
  const r = parseFloat(rMatch[1]);
  const p = pMath[1].split(" ").map(parseFloat);
  const rV = {
    s: [r, p],
    e: [parseFloat(c[0]), c[1]],
    ease: c[2] ? ease_default(c[2]) : easing
  };
  const RLerp = rV.e[0] - rV.s[0];
  const PXLerp = rV.e[1][0] - rV.s[1][0];
  const PYLerp = rV.e[1][1] - rV.s[1][1];
  return (t) => {
    const e = rV.ease(t);
    return `circle(${rV.s[0] + RLerp * e}% at ${rV.s[1][0] + PXLerp * e}% ${rV.s[1][1] + PYLerp * e}%)`;
  };
};
var setValue11 = (e, v) => e.style.clipPath = v;
var circle_default = {
  cb: circle,
  setValue: setValue11
};

// src/Utils/props/properties/polygon.js
var points2 = (clipPath) => {
  return clipPath.replace(/^polygon\(|\)$/g, "").split(",").map((point) => point.trim().split(" ").map(parseFloat));
};
var polygon = (p, {
  clipPath,
  easing
}) => {
  const pV = {
    s: points2(clipPath),
    e: points2(p[0]),
    ease: p[1] ? ease_default(p[1]) : easing
  };
  pV.lerp = pV.e.map((endPoint, i) => [endPoint[0] - pV.s[i][0], endPoint[1] - pV.s[i][1]]);
  return (t) => {
    const e = pV.ease(t);
    return `${pV.s.map((t2, i) => `${t2[0] + pV.lerp[i][0] * e}% ${t2[1] + pV.lerp[i][1] * e}%`).join(", ")}`;
  };
};
var setValue12 = (e, v) => e.style.clipPath = `polygon(${v})`;
var polygon_default = {
  cb: polygon,
  setValue: setValue12
};

// src/Utils/props/tools/regexs.js
var regexs = [[/^(move)$/, transform_default], [/^(a)$/, alpha_default], [/^(width)$/, width_default], [/^(height)$/, height_default], [/^(top)$/, top_default], [/^(blur)$/, blur_default], [/^(draw)$/, draw_default], [/^(dash)$/, dash_default], [/^(points)$/, points_default], [/^(d)$/, d_default], [/^(circle)$/, circle_default], [/^(polygon)$/, polygon_default]];
var regexs_default = regexs;

// src/Utils/props/tools/matches.js
function matchs(name) {
  const length2 = regexs_default.length;
  for (let i = 0; i < length2; i++) {
    const regex = regexs_default[i];
    if (name.match(regex[0]))
      return regex[1];
  }
}

// src/Utils/props/props.js
function dom(e, ps, results, easing) {
  const compute = computed(e);
  compute.el = e;
  compute.parent = e.parentNode;
  compute.easing = easing;
  for (const key of Object.entries(ps)) {
    const values = matchs(key[0]);
    const cb = values.cb(key[1], compute);
    results.push({
      setV: values.setValue,
      cb
    });
  }
}
function obj(e, ps, results, easing) {
  for (const key in ps) {
    const oV = {
      s: e[key],
      e: ps[key][0],
      ease: ps[key][1] ? ease_default(ps[key][1]) : easing
    };
    oV.lerp = oV.e - oV.s;
    results.push({
      setV: (e2, v) => e2[key] = v,
      cb: (e2) => oV.s + oV.lerp * oV.ease(e2)
    });
  }
}
function props(e, o, ps, easing) {
  const results = [];
  if (!o)
    dom(e, ps, results, easing);
  else
    obj(e, ps, results, easing);
  return results;
}
var props_default = props;

// src/Core/Observer/observer.js
var Observer = class {
  #observers = {};
  /**
   * @param {String} name - observer name
   */
  create(name) {
    this.#observers[name] = {
      items: [],
      id: 0
    };
    function callItem() {
      let target = this[name];
      let args = Array.prototype.slice.call(arguments);
      for (let i = 0; i < target.items.length; i++) {
        target.items[i].cb(...args);
      }
    }
    let remove = (name2) => this.#observers[name2].items = [];
    return {
      cb: callItem.bind(this.#observers),
      name,
      r: remove.bind(this, name)
    };
  }
  /**
   * @param {String} name - observer name
   * @param {Function} cb - callback function
   */
  subscribe(name, cb) {
    if (!this.#observers[name])
      console.error(name);
    let items = this.#observers[name].items;
    let id = ++this.#observers[name].id;
    let obj2 = {
      cb,
      id,
      subscribed: true
    };
    items.push(obj2);
    let remove = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === o.id) {
          items[i].subscribed = false;
          items.splice(i, 1);
        }
      }
    };
    return {
      onChange: (cb2) => {
        obj2.cb = cb2;
        return {
          r: () => remove(obj2),
          item: obj2
        };
      }
    };
  }
  /**
   * @param {String} name - observer name
   */
  check(name) {
    return this.#observers[name] ? true : false;
  }
};
var observer_default = new Observer();

// src/Utils/raf/tools/visiability.js
var Visiability = class {
  constructor() {
  }
  init(raf2) {
    if (!this.raf) {
      observer_default.subscribe("visibilitychange").onChange(this.#change.bind(this));
      this.raf = raf2;
    }
  }
  #change() {
    const now = performance.now();
    if (document.hidden)
      this.hide = now;
    else
      this.raf.items.map((item) => item.st += now - this.hide);
  }
};
var visiability_default = new Visiability();

// src/Utils/raf/raf.js
var Raf = class {
  constructor() {
    this.items = [];
    this.id = -1;
  }
  /**
   * Push Objects.
   * @param {{cb: Function, d: number}} o
   * @returns {Number} - object id.
   */
  push(o) {
    o.id = ++this.id;
    this.items.push(o);
    if (!this.on) {
      this.loop();
      visiability_default.init(this);
    }
    return o.id;
  }
  update(t) {
    for (let i = 0; i < this.items.length; i++) {
      const o = this.items[i];
      if (o.d) {
        if (!o.st)
          o.st = t;
        const time = (t - o.st) / (o.d * 1e3);
        const elapsed = clamp(0, 1, time);
        o.cb(elapsed);
        if (elapsed === 1)
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
var raf = new Raf();
var raf_default = raf;

// src/Utils/helpers/scrub.js
function scrub(cb) {
  const node = document.createElement("section");
  const lProg = {
    start: 0,
    end: 0,
    lerp: 0.75
  };
  node.style.cssText = ` position: fixed; height: 32px; width: 32px; display: flex; align-items: center; justify-content: center; font-size: 12px; background: #333; color: #fff; border-radius: 50%; pointer-events: none; `;
  observer_default.add("pointermove").onChange((e) => {
    const progress = round(e.pageX / window_default.screen.w);
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
  constructor({
    d: d3,
    o,
    cb
  }) {
    this.d = d3 || 0;
    this.o = o;
    this.cb = cb;
    this.on = false;
  }
  /**
   * Push to the Raf.
   */
  play() {
    this.on = true;
    if (this.d === 0)
      this.Elp();
    else
      this.id = raf_default.push({
        cb: this.loop.bind(this),
        d: this.d
      });
  }
  destroy() {
    raf_default.kill(this.id);
    this.on = false;
  }
  loop(t) {
    if (t === 1)
      this.Elp();
  }
  /**
   * On compeletion.
   */
  Elp() {
    this.on = false;
    if (this.o)
      raf_default.push(this.o);
    if (this.cb)
      this.cb();
  }
};

// src/Core/tween/tools/targeted.js
function element(ele) {
  this.isObj = false;
  if (ele instanceof Node) {
    this.target = ele;
  } else if (typeof ele == "string") {
    this.target = query_default.el(ele);
  } else {
    this.isObj = true;
    this.target = ele;
  }
}

// src/Core/tween/tools/stored.js
var store = /* @__PURE__ */ new Map();
function stored(node, tweenClass) {
  let stored2 = store.get(node);
  if (!stored2) {
    store.set(node, tweenClass);
    tweenClass.init(node);
    return tweenClass;
  } else {
    return stored2;
  }
}

// src/Core/tween/tools/compare.js
var compare = (o1, o2) => toString(o1) === toString(o2);
var compare_default = compare;

// src/Core/tween/tween.js
var Tween = class {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   */
  constructor(element2) {
    const stored2 = stored(element2, this);
    return stored2;
  }
  /**
   * Setting up the class.
   */
  init(element2) {
    element.call(this, element2);
    this.call = -1;
    this.props = [];
    this.queue = [];
    this.prog = 0;
    this.elapsed = 0;
  }
  /**
   * Loop.
   * @param {Number} t - elapsed time.
   */
  run(t) {
    this.on = true;
    this.elapsed = clamp(0, 1, this.prog + t);
    const dir = Math.abs(this.dir - this.elapsed);
    const from = Math.abs(dir - this.from);
    this.props.map(({
      setV,
      cb
    }) => setV(this.target, cb(from)));
    this.raf && this.raf(dir, this.target);
    if (this.elapsed === 1)
      this.finished();
  }
  push(roll) {
    this.destroy();
    this.dir = roll.dir;
    this.mode = roll.mode;
    this.from = roll.from ? 1 : 0;
    if (this.started) {
      this.started(this.target);
      this.started = null;
    }
    if (roll.oProps) {
      this.oProps = roll.oProps;
      this.props = props_default(this.target, this.isObj, roll.oProps, ease_default(roll.ease));
      this.prog = 0;
    } else
      this.prog = 1 - this.elapsed;
    this.rafObj = {
      cb: this.run.bind(this),
      d: roll.d
    };
    this.id = raf_default.push(this.rafObj);
  }
  /**
   * Controaling animation (forward, reversed).
   * @param {String} m - the mode.
   * @param {Boolean} n - check if the properties has changed.
   *
   */
  control() {
    const roll = this.queue[this.call];
    if (compare_default(this.oProps, roll.oProps))
      roll.oProps = void 0;
    else {
      this.late = new Late({
        cb: this.push.bind(this, roll),
        d: roll.late
      });
      this.late.play();
    }
    if (this.mode !== roll.mode) {
      if (this.late.on)
        this.late.destroy();
      this.late = new Late({
        cb: this.push.bind(this, roll),
        d: roll.late
      });
      this.late.play();
    }
  }
  /**
   * (Checkt/Update) properties object
   *
   * @param {Object} o - The new properties.
   */
  play(o, mode) {
    this.call++;
    this.started = o.started;
    this.completed = o.completed;
    this.raf = o.raf;
    this.queue.push({
      d: o.d,
      late: o.late,
      ease: o.ease,
      oProps: o.p,
      mode,
      from: o.from,
      dir: mode === "r" ? 1 : 0
    });
    this.control();
  }
  destroy() {
    this.on = false;
    raf_default.kill(this.id);
  }
  finished() {
    this.destroy();
    if (this.completed) {
      this.completed(this.target);
      this.completed = null;
      this.raf = null;
    }
  }
};
var tween_default = Tween;

// src/Core/tween/index.js
var events = (o, i, length2) => {
  const obj2 = {
    ...o
  };
  if (i !== 0) {
    obj2.started = null;
    obj2.raf = null;
  }
  if (i !== length2)
    obj2.completed = null;
  obj2.late = o.late + o.space * i;
  return obj2;
};
var change = (obj2, o) => {
  o.d = typeof obj2.d === "number" ? obj2.d : o.d || 0.5;
  o.late = typeof obj2.late === "number" ? obj2.late : o.late || 0;
  o.space = typeof obj2.space === "number" ? obj2.space : o.space || 0;
  o.ease = obj2.ease ? obj2.ease : o.ease || "l";
  o.p = obj2.p;
};
function Interface(els, o) {
  let nodes;
  if (Array.isArray(els) && !o.obj)
    nodes = els;
  else
    nodes = [els];
  const tweens = nodes.map((node) => new tween_default(node));
  const length2 = tweens.length - 1;
  const methods = {
    reverse: (obj2 = {}) => {
      change(obj2, o);
      for (let i = 0; i <= length2; i++) {
        const idx = length2 - i;
        tweens[i].play(events(o, idx, length2), "r");
      }
    },
    play: (obj2 = {}) => {
      change(obj2, o);
      tweens.map((tween, i) => tween.play(events(o, i, length2), "p"));
    },
    destroy: () => tweens.map((tween) => tween.late.destroy()),
    tweens
  };
  methods.play(o);
  return methods;
}
var tween_default2 = Interface;

// src/Core/scroll/tools/trigger.js
var match = (str = "+0", bs) => {
  let plus;
  if (Array.isArray(str)) {
    plus = offset(str[0]).y + str[1];
    return plus;
  } else {
    plus = str.toString().match(/(\+|\-)(.*)/);
    if (plus[1] === "+")
      return bs + +plus[2];
    else if (plus[1] === "-")
      return bs - +plus[2];
  }
};
var Trigger = class {
  /**
   * @param {HTMLElement} el - targeted element
   * @param {Object} o - properties
   * @param {String} subname - Loop name
   * @param {Object} dir - scolling direction
   */
  constructor(el, o) {
    this.el = el;
    this.target = o.target;
    this.o = o;
    this.pin = o.pin;
    this.scroll = o.scroll;
    this.from = o.from ? 1 : 0;
    this.dir = o.dir;
    this.dirE = o.dir === "y" ? "yE" : "xE";
    this.Init(o);
  }
  Init(o) {
    if (!o.target)
      this.target = this.el;
    if (o.scroll)
      this.ps = props_default(this.target, false, o.p);
    if (o.pin)
      this.pin.target = o.pin.target || this.target;
    this.iraf = observer_default.subscribe(o.obsname).onChange(this.raf.bind(this));
    this.iresize = observer_default.subscribe("resize").onChange(this.resize.bind(this));
    this.resize();
  }
  /**
   * resize
   */
  resize() {
    const element2 = this.el.length ? this.el[0] : this.el;
    const bs = offset(element2);
    if (this.scroll) {
      this.startpint = match(this.scroll.start, bs[this.dir]);
      this.endpoint = match(this.scroll.end, bs[this.dirE]);
    } else {
      this.startpint = match(this.o.start, bs[this.dir]);
      this.endpoint = match(this.o.end, bs[this.dirE]);
    }
    if (this.pin) {
      this.pin.start = match(this.pin.a, bs[this.dir]);
      this.pin.end = match(this.pin.z, bs[this.dirE]);
    }
  }
  /**
   * Loop
   */
  raf(coord) {
    this.coord = coord.lerp;
    if (this.o.scroll) {
      const remap2 = map(this.startpint, this.endpoint, this.coord);
      this.onScroll(remap2);
      if (this.o.pin)
        this.piner();
      if (this.o.raf)
        this.o.raf(remap2, this.target, this.coord);
    } else if (this.startpint <= this.coord)
      this.fire();
  }
  /**
   * Animate with scrolling
   */
  onScroll(t) {
    const diraction = Math.abs(t - this.from);
    this.ps.map((p) => {
      if (this.target.length)
        this.target.forEach((el) => p.setV(el, p.cb(diraction)));
      else
        p.setV(this.target, p.cb(diraction));
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
        const dist2 = Math.max(0, this.coord - this.pin.pxS);
        this.pin.target.style.transform = `translate3d(${this.dir ? "0px," + dist2 + "px" : dist2 + "px,0px"},0px)`;
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
var trigger_default = Trigger;

// src/Core/scroll/tools/events.js
var Events = class {
  constructor(attacher, options) {
    this.options = options;
    this.attacher = attacher;
    this.target = options.target;
    this.observer = observer_default.create(options.obs || Symbol("foo"));
    this.dir = options.dir ? options.dir : "y";
    this.isY = this.dir === "y";
    this.pageDir = this.isY ? "pageY" : "pageX";
    this._events(options);
    this.chokeEl = query_default.id("overlay");
    this.choke = new Choke({
      d: 0.3,
      cb: () => css_default.pointer(this.chokeEl, "none")
    });
    this.dist = 0;
    this.scroll = {
      value: 0,
      lerp: 0,
      dir: 1
    };
  }
  _events(options) {
    if (Object.is(this.attacher, window)) {
      if (options.drag !== false) {
        this.ipointerdown = observer_default.subscribe("pointerdown").onChange(this._down.bind(this));
        this.ipointermove = observer_default.subscribe("pointermove").onChange(this._move.bind(this));
      }
      if (options.key !== false) {
        this.ikey = observer_default.subscribe("keydown").onChange(this._onkey.bind(this));
      }
      if (options.wheel !== false) {
        this.iwheel = observer_default.subscribe("wheel").onChange(this._wheel.bind(this));
      }
      this.global = true;
    } else {
      if (options.wheel !== false) {
        this.attacher.onwheel = this._wheel.bind(this);
      }
      if (options.drag !== false) {
        this.attacher.onpointerdown = this._down.bind(this);
        this.attacher.onpointermove = this._move.bind(this);
      }
    }
    this.ipointerup = observer_default.subscribe("pointerup").onChange(this._up.bind(this));
    this.iresize = observer_default.subscribe("resize").onChange(this._resize.bind(this));
  }
  _wheel(e) {
    let multip = e.deltaMode === 1 ? 0.83 : 0.55;
    let offset2 = e.wheelDeltaY * multip;
    this.scroll.value -= offset2;
    this.scroll.dir = Math.sign(offset2);
  }
  _onkey(e) {
    if (e.key === "Tab")
      e.preventDefault();
    else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        let offset2 = 0;
        if (e.keyCode === 40)
          offset2 = -66.6;
        else if (e.keyCode === 38)
          offset2 = 66.6;
        this.scroll.value -= offset2;
      }
    }
  }
  _down(e) {
    this.mousedown = true;
    this.dist = e[this.pageDir];
  }
  _move(e) {
    if (this.mousedown) {
      let offset2 = e[this.pageDir] - this.dist;
      this.scroll.value -= offset2;
      this.dist = e[this.pageDir];
      this.scroll.dir = Math.sign(offset2);
      if (this.global)
        css_default.pointer(this.chokeEl, "all");
    }
  }
  _up() {
    this.mousedown = false;
    this.choke.run();
  }
  _destroy() {
    this.iraf.r();
    this.iresize.r();
    if (this.global) {
      if (this.ipointerdown) {
        this.ipointerdown.r();
        this.ipointermove.r();
      }
      if (this.ikey)
        this.ikey.r();
      if (this.iwheel)
        this.iwheel.r();
    } else {
      if (this.options.wheel !== false) {
        this.attacher.onwheel = null;
      }
      if (this.options.drag !== false) {
        this.attacher.onpointerdown = null;
        this.attacher.onpointermove = null;
      }
    }
    this.ipointerup.r();
    this.observer.r();
  }
};

// src/Core/scroll/scroll.js
var isYDir = (dom2, value, isY) => {
  if (isY)
    css_default.form(dom2, "px", 0, value);
  else
    css_default.form(dom2, "px", value, 0);
};
var inRange = (start, end, bs, kid, isY, l) => {
  if (start <= bs.z && end >= bs.a) {
    isYDir(kid, -l, isY);
    bs.out = false;
  } else {
    if (!bs.out) {
      isYDir(kid, -l, isY);
      bs.out = true;
    }
  }
};
var Scroll = class extends Events {
  /**
   * @param {HTMLElement|Window} attacher - the parent
   * @param {Object} o - properties
   */
  constructor(attacher, o) {
    super(attacher, o);
    this.infinite = o.infinite;
    this.ease = o.ease || 0.09;
    this.speed = {
      time: performance.now(),
      offset: 0,
      value: 0,
      ease: o.speed || 0.3
    };
    this._resize();
    this.iraf = observer_default.subscribe("raf").onChange(this._raf.bind(this));
  }
  add(target, o) {
    o.obsname = this.observer.name;
    o.dir = this.dir;
    return new trigger_default(target, o);
  }
  _raf(t) {
    if (!this.infinite)
      this.scroll.value = clamp(0, this.dim, this.scroll.value);
    this.scroll.lerp = damp(this.scroll.lerp, this.scroll.value, this.ease);
    this.speed.time = t - this.speed.time;
    this.speed.offset = this.scroll.lerp - this.speed.offset;
    this.speed.value = damp(this.speed.value, this.speed.offset / this.speed.time, this.speed.ease);
    if (this.infinite) {
      if (this.scroll.lerp > this.dim) {
        this.scroll.value = this.scroll.value - this.dim;
        this.scroll.lerp = this.scroll.lerp - this.dim;
      } else if (this.scroll.lerp < 0) {
        this.scroll.value = this.dim + this.scroll.value;
        this.scroll.lerp = this.dim + this.scroll.lerp;
      }
      this.infinite.map(([kid, bs]) => {
        const start = this.scroll.lerp;
        const end = start + this.screen;
        if (this.scroll.lerp > this.dim - this.screen) {
          const offsetS = this.scroll.lerp - (this.dim - this.screen) - this.screen;
          const offsetE = offsetS + this.screen;
          if (offsetS <= bs.z && offsetE >= bs.a)
            isYDir(kid, this.screen - offsetE, this.isY);
          else
            inRange(start, end, bs, kid, this.isY, this.scroll.lerp);
        } else
          inRange(start, end, bs, kid, this.isY, this.scroll.lerp);
      });
    } else
      isYDir(this.target, -this.scroll.lerp, this.isY);
    this.speed.time = t;
    this.speed.offset = this.scroll.lerp;
    console.log(this.scroll.lerp);
    this.observer.cb(this.scroll);
  }
  _resize() {
    this.bs = bounds(this.target);
    if (this.infinite) {
      const childs = [...this.target.children];
      this.infinite = childs.map((kid) => {
        const a = this.isY ? kid.offsetTop : kid.offsetLeft;
        const z = this.isY ? kid.offsetHeight : kid.offsetWidth;
        return [kid, {
          a,
          z: a + z
        }];
      });
    }
    const d3 = this.isY ? "h" : "w";
    this.screen = window_default.screen[d3];
    this.dim = this.bs[d3] - (this.infinite ? 0 : this.screen);
  }
};
var scroll_default = Scroll;

// src/Plugins/line/line.js
var space = " ";
function init(div, compute) {
  document.body.append(div);
  div.style.visibility = "hidden";
  div.style.position = "absolute";
  div.style.whiteSpace = "nowrap";
  div.style.fontFamily = compute.getPropertyValue("font-family");
  div.style.fontSize = compute.getPropertyValue("font-size");
  div.style.fontWeight = compute.getPropertyValue("font-weight");
  div.style.textTransform = compute.getPropertyValue("text-transform");
  div.style.letterSpacing = compute.getPropertyValue("letter-spacing");
  div.style.lineHeight = compute.getPropertyValue("line-height");
}
function splitText(node) {
  const nodes = node.childNodes;
  const output = [];
  for (let i = 0; i < nodes.length; i++) {
    output.push(types(nodes[i]));
  }
  return output;
}
function types(node) {
  let output;
  if (node.nodeType === 3) {
    output = {
      value: node.nodeValue.split(" "),
      type: 3
    };
  } else {
    output = {
      value: splitText(node),
      type: 1,
      node
    };
  }
  return output;
}
function filter(text) {
  for (let i = 0; i < text.length; i++) {
    const key = text[i];
    if (key.type === 3) {
      const value = [];
      for (let k = 0; k < key.value.length; k++) {
        key.value[k] = key.value[k].replace(/\n/g, "");
        if (key.value[k] !== "")
          value.push(key.value[k]);
      }
      key.value = value;
    } else {
      filter(key.value);
    }
  }
}
function domOutput(lines, output, o) {
  if (o.words) {
    const len = lines.words.length;
    let line;
    if (o.ltrs) {
      line = lines.words.reduce((a, b, i) => {
        let str = "";
        for (let i2 = 0; i2 < b.length; i2++)
          str += wrap(b[i2], 3);
        return a + wrap(str + (i == len - 1 ? "" : space), 2);
      }, "");
    } else {
      line = lines.words.reduce((a, b, i) => {
        return a + wrap(b + (i == len - 1 ? "" : space), 2);
      }, "");
    }
    output.push({
      line: wrap(line, 1)
    });
  } else {
    output.push({
      line: wrap(lines.value, 1)
    });
  }
}
function wrap(text, type) {
  if (type === 1) {
    return `<div class="tfx"><span>${text}</span></div>`;
  } else if (type === 2) {
    return `<span class="word">${text}</span>`;
  } else if (type === 3) {
    return `<span class="ltr">${text}</span>`;
  }
}
function check(value, lines, div, width2, output, o) {
  for (let k = 0; k < value.length; k++) {
    const word = value[k];
    lines.value += word;
    div.innerHTML = lines.value;
    lines.words.push(word);
    if (div.offsetWidth > width2) {
      lines.words.pop();
      domOutput(lines, output, o);
      lines.value = word;
      lines.words = [word + space];
    }
    lines.value += space;
  }
}
function newline(obj2, div, width2, o) {
  const lines = {
    value: "",
    words: []
  };
  const output = [];
  for (let i = 0; i < obj2.length; i++) {
    const node = obj2[i];
    if (node.type === 3) {
      check(node.value, lines, div, width2, output, o);
    } else {
    }
  }
  domOutput(lines, output, o);
  return output;
}
function split(node, o) {
  let compute = computed(node);
  let div = document.createElement("div");
  if (o.ltrs)
    o.words = true;
  init(div, compute);
  const width2 = node.offsetWidth;
  let obj2 = splitText(node);
  filter(obj2);
  const output = newline(obj2, div, width2, o);
  node.innerHTML = "";
  document.body.removeChild(div);
  output.map(({
    line
  }) => node.innerHTML += line);
  return {
    lines: query_default.sEls(node, ".tfx"),
    words: query_default.sEls(node, ".word"),
    ltrs: query_default.sEls(node, ".ltr")
  };
}
var line_default = split;
export {
  bounds,
  Choke as choke,
  clamp,
  computed,
  css_default as css,
  damp,
  dist,
  ease_default as ease,
  isHas,
  Late as late,
  lerp,
  line_default as line,
  map,
  observer_default as observer,
  offset,
  props_default as props,
  query_default as query,
  raf_default as raf,
  remap,
  round,
  scroll_default as scroll,
  scrub,
  toString,
  tween_default2 as tween,
  window_default as win
};
