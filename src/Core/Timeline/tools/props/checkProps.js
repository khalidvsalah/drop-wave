import { Computed } from "../../../../index";
import props from "./props.js";

export default function checkProps(e, o, ps) {
  let results = [];

  if (!o) {
    let x, y, o, sx, sy, rx, ry, d;
    let c = Computed(e);

    x = ps["x"] || false;
    y = ps["y"] || false;

    sx = ps["sx"] || false;
    sy = ps["sy"] || false;

    rx = ps["rx"] || false;
    ry = ps["ry"] || false;

    o = ps["o"] || false;
    d = ps["dash"] || false;

    if (x || y || sx || sy || rx || ry) {
      results.push({
        name: "transform",
        cb: props["t"](x, y, sx, sy, rx, ry, c),
      });
    }

    if (o) {
      results.push({
        name: "opacity",
        cb: props["o"](o, c),
      });
    }

    if (d) {
      results.push({
        name: "strokeDashoffset",
        cb: props["d"](d, c),
      });
    }
  } else if (o) {
    for (let key in ps) {
      let p = ps[key];
      let pV = { s: p[0], lerp: p[1] - p[0] };

      results.push({
        name: key,
        cb: (e) => pV.s + pV.lerp * e,
      });
    }
  }

  return results;
}
