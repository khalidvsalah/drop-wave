export const Has = (e, p) => window.hasOwnProperty.call(e, p);
export const Bounds = (ele) => ele.getBoundingClientRect();
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
