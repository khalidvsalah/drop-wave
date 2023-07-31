export const Has = (e, p) => window.hasOwnProperty.call(e, p);
export const Bounds = (e) => e.getBoundingClientRect();
export const Computed = (c) => window.getComputedStyle(c);
export const deepCopy = (o) => {
  let tO, v, k;

  if (typeof o !== "object" || o === null) return o;

  tO = Array.isArray(o) ? [] : {};

  for (k in o) {
    v = o[k];
    tO[k] = deepCopy(v);
  }

  return tO;
};
export const iSet = {
  o: (e, v) => (e.style.opacity = v),
  d: (e, v) => (e.style.display = v),
  p: (e, v) => (e.style.pointerEvents = v),
  id: (s) => document.getElementById(s),
  el: (s) => document.querySelector(s),
  els: (s) => document.querySelectorAll(s),
};
