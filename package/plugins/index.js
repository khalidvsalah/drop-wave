/* @khalidvsalah | blinkwave | v0.0.1 | MIT License | https://github.com/khalidvsalah/blink-wave */ // src/Math/operations.js
var clamp = (min, max, a) => Math.min(Math.max(min, a), max);

// src/Core/methods/methods.js
var computed = (c) => window.getComputedStyle(c);

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
    this.observers[name] = { items: [] };
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
    let obj = { cb, id: items.length + 1, on: true };
    items.push(obj);
    let r = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == o) {
          items[i].on = false;
          items.splice(i, 1);
        }
      }
    };
    return {
      item: obj,
      r: r.bind({}, obj.id)
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

// src/Core/scroll/scroll.js
function globalEvents() {
  let called = false;
  return () => {
    if (!called) {
      called = true;
      window.addEventListener("pointerdown", observer_default.obs("pointerdown").cb);
      window.addEventListener("pointermove", observer_default.obs("pointermove").cb);
      window.addEventListener("pointerup", observer_default.obs("pointerup").cb);
      window.addEventListener("wheel", observer_default.obs("wheel").cb);
      window.addEventListener("resize", observer_default.obs("resize").cb);
      raf_default.push({ cb: observer_default.obs("raf").cb });
    }
  };
}
var fireGlobalEvents = globalEvents();

// src/Plugins/src/line.js
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
var getWidth = (node) => {
  node.style.display = "inline-block";
  return node.offsetWidth;
};
function splitText(node) {
  const nodes = node.childNodes;
  const output2 = [];
  for (let i = 0; i < nodes.length; i++) {
    output2.push(types(nodes[i]));
  }
  return output2;
}
function types(node) {
  let output2;
  if (node.nodeType === 3) {
    output2 = { value: node.nodeValue.split(" "), type: 3 };
  } else {
    output2 = { value: splitText(node), type: 1, node };
  }
  return output2;
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
function measure(node, key, line) {
  const space = "&nbsp;";
  if (node.type === 3) {
    const word = key + space;
    line.value += word;
    line.words.push({ word, node: node.node });
  } else {
    for (let i = 0; i < key.value.length; i++) {
      const word = key.value[i] + space;
      line.value += word;
      line.words.push({ word, node: node.node });
    }
  }
}
function lines(text, span, width) {
  const line = { value: "", words: [] };
  const output2 = [];
  for (let i = 0; i < text.length; i++) {
    const node = text[i];
    for (let k = 0; k < node.value.length; k++) {
      const key = node.value[k];
      const prev = line.value.length - 1;
      measure(node, key, line);
      span.innerHTML = line.value;
      if (span.offsetWidth > width) {
        const sentance = line.value.substring(0, prev);
        line.words.pop();
        output2.push({ sentance, words: line.words });
        if (text.length !== 1 || node.value.length !== 1) {
          k -= 1;
        }
        line.value = "";
        line.words = [];
      }
    }
    if (i === text.length - 1) {
      const sentance = line.value.substring(0, line.value.length - 1);
      output2.push({ sentance, words: line.words });
    }
  }
  return output2;
}
function wrapper(text, node, type) {
  if (type === 1) {
    return `<p class="line"><span>${text}</span></p>`;
  } else if (type === 2) {
    let ele = document.createElement("span");
    if (node) {
      const a = node.cloneNode();
      a.innerHTML = text;
      ele.appendChild(a);
    } else {
      ele.innerHTML = text;
    }
    return `<span class="word">${ele.innerHTML}</span>`;
  } else if (type === 3) {
    return `<span class="letter">${text}</span>`;
  }
}
function output(node, arr, o = {}) {
  let sentance = "";
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i].words;
    for (let k = 0; k < key.length; k++) {
      const word = key[k].word;
      if (o.letters) {
        let space = word.indexOf("&nbsp;") - 1;
        let letter = "";
        for (let j = 0; j < word.length; j++) {
          if (space === j) {
            letter += wrapper(word.slice(space), "", 3);
            break;
          } else {
            letter += wrapper(word[j], "", 3);
          }
        }
        sentance += wrapper(letter, key[k].node, 2);
      } else {
        sentance += wrapper(word, key[k].node, 2);
      }
    }
    node.innerHTML += wrapper(sentance, "", 1);
    sentance = "";
  }
}
function split(node, o) {
  let compute = computed(node);
  let span = document.createElement("div");
  init(span, compute);
  const width = getWidth(node);
  let text = splitText(node);
  filter(text);
  const arr = lines(text, span, width);
  document.body.removeChild(span);
  node.innerHTML = "";
  output(node, arr, o);
  return {
    words: node.querySelectorAll(".word"),
    letters: node.querySelectorAll(".letter")
  };
}
var line_default = split;

// src/Plugins/index.js
var Plugins_default = line_default;
export {
  Plugins_default as default
};
