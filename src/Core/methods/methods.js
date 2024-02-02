const has = (e, p) => window.hasOwnProperty.call(e, p);
const bounds = e => {
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
const computed = c => window.getComputedStyle(c);
const cssSet = {
  alpha: (e, v) => (e.style.opacity = v),
  display: (e, v) => (e.style.display = v),
  pointer: (e, v) => (e.style.pointerEvents = v),
  position: (e, v) => (e.style.position = v),
  visible: (e, v) => (e.style.visibility = v),
  form: (e, p, x, y) => (e.style.transform = `translate3d(${x + p},${y + p},0)`)
};
const query = {
  id: s => document.getElementById(s),
  el: s => document.querySelector(s),
  els: s => [...document.querySelectorAll(s)],
  sEl: (e, s) => e.querySelector(s),
  sEls: (e, s) => [...e.querySelectorAll(s)],
  node: type => document.createElement(type),
  text: text => document.createTextNode(text)
};
const iSet = {
  get size() {
    return { w: window.innerWidth, h: window.innerHeight };
  },
  string: obj => JSON.stringify(obj)
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
export { has, bounds, computed, iSet, cssSet, query, choke };
