/* @khalidvsalah | blinkwave | v0.0.1 | MIT License | https://github.com/khalidvsalah/blink-wave */ // src/Math/math.js
var clamp = (min, max, a) => Math.min(Math.max(min, a), max);

// src/Core/methods/methods.js
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
  string: (obj) => JSON.stringify(obj),
  visible: (e, v) => e.style.visibility = v
};

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
    let obj = { cb, id, on: true };
    items.push(obj);
    let r = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == o.id) {
          items[i].on = false;
          items.splice(i, 1);
        }
      }
    };
    return {
      item: obj,
      r: r.bind({}, obj)
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

// src/Plugins/src/line.js
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
    output = { value: node.nodeValue.split(" "), type: 3 };
  } else {
    output = { value: splitText(node), type: 1, node };
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
    output.push({ line: wrap(line, 1) });
  } else {
    output.push({ line: wrap(lines.value, 1) });
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
function check(value, lines, div, width, output, o) {
  for (let k = 0; k < value.length; k++) {
    const word = value[k];
    lines.value += word;
    div.innerHTML = lines.value;
    lines.words.push(word);
    if (div.offsetWidth > width) {
      lines.words.pop();
      domOutput(lines, output, o);
      lines.value = word;
      lines.words = [word + space];
    }
    lines.value += space;
  }
}
function newline(obj, div, width, o) {
  const lines = { value: "", words: [] };
  const output = [];
  for (let i = 0; i < obj.length; i++) {
    const node = obj[i];
    if (node.type === 3) {
      check(node.value, lines, div, width, output, o);
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
  const width = node.offsetWidth;
  let obj = splitText(node);
  filter(obj);
  const output = newline(obj, div, width, o);
  node.innerHTML = "";
  document.body.removeChild(div);
  output.map(({ line }) => node.innerHTML += line);
  return {
    lines: iSet.sEls(node, ".tfx"),
    words: iSet.sEls(node, ".word"),
    ltrs: iSet.sEls(node, ".ltr")
  };
}
var line_default = split;

// src/Plugins/index.js
var Plugins_default = line_default;
export {
  Plugins_default as default
};
