import { Computed } from "../../../../index";
import props from "./props.js";

function dom(e, ps) {
  let results = [];

  let x, y, o, sx, sy, rx, ry, dash, points, d, t, blur;
  let c = Computed(e);

  c.el = e;
  c.pa = e.parentNode;

  x = ps["x"] || false;
  y = ps["y"] || false;

  sx = ps["sx"] || false;
  sy = ps["sy"] || false;

  rx = ps["rx"] || false;
  ry = ps["ry"] || false;

  o = ps["o"] || false;

  dash = ps["dash"] || false;
  points = ps["points"] || false;
  d = ps["d"] || false;

  t = ps["t"] || false;

  blur = ps["blur"] || false;

  if (x || y || sx || sy || rx || ry) {
    results.push({
      setV: (v) => (e.style.transform = v),
      cb: props["t"](x, y, sx, sy, rx, ry, c),
    });
  }

  if (o) {
    results.push({
      setV: (v) => (e.style.opacity = v),
      cb: props["o"](o, c),
    });
  }

  if (dash) {
    results.push({
      setV: (v) => (e.style.strokeDashoffset = v),
      cb: props["dash"](dash, c),
    });
  }

  if (points) {
    results.push({
      setV: (v) => e.setAttribute("points", v),
      cb: props["points"](points, c),
    });
  }

  if (d) {
    results.push({
      setV: (v) => e.setAttribute("d", v),
      cb: props["d"](d, c),
    });
  }

  if (t) {
    results.push({
      setV: (v) => (e.style.top = v),
      cb: props["top"](t, c),
    });
  }

  if (blur) {
    results.push({
      setV: (v) => (e.style.filter = `blur(${v}px)`),
      cb: props["blur"](blur, c),
    });
  }

  return results;
}

function obj() {
  let results = [];

  for (let key in ps) {
    let p = ps[key];
    let pV = { s: p[0], lerp: p[1] - p[0] };

    results.push({
      name: key,
      cb: (e) => pV.s + pV.lerp * e,
    });
  }

  return results;
}

export default function checkProps(e, o, ps) {
  if (!o) return dom(e, ps);
  else return obj();
}
