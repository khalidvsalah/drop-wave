const has = (e, p) => window.hasOwnProperty.call(e, p);
const bounds = (e) => {
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
const computed = (c) => window.getComputedStyle(c);
const iSet = {
  alpha: (e, v) => (e.style.opacity = v),
  display: (e, v) => (e.style.display = v),
  pointer: (e, v) => (e.style.pointerEvents = v),
  id: (s) => document.getElementById(s),
  el: (s) => document.querySelector(s),
  els: (s) => [...document.querySelectorAll(s)],
  get screen() {
    return { w: window.innerWidth, h: window.innerHeight };
  },
  position: (e, v) => (e.style.position = v),
  node: (type) => document.createElement(type),
  text: (text) => document.createTextNode(text),
  string: (obj) => JSON.stringify(obj),
  visible: (e, v) => (e.style.visibility = v)
};
class choke {
  constructor({ late, cb }) {
    this.late = late * 1000;
    this.cb = cb;
    this.time = 0;
  }

  run() {
    clearTimeout(this.time);
    this.time = setTimeout(this.cb, this.late);
  }
}
export { has, bounds, computed, iSet, choke };
