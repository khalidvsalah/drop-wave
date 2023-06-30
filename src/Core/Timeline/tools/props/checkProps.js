import props from "./props.js";

export default function checkProps() {
  this.results = [];

  if (this.ps && !this.obj) {
    let x, y, o, p, d, sx, sy, t;

    let ele = this.target;
    let c = window.getComputedStyle(ele);
    let ph = ele.parentNode.clientHeight;

    x = this.ps["x"] || false;
    y = this.ps["y"] || false;

    sx = this.ps["sx"] || false;
    sy = this.ps["sy"] || false;

    t = this.ps["t"] || false;

    o = this.ps["opacity"] || false;
    p = this.ps["pointer"] || false;
    d = this.ps["display"] || false;

    if (x || y || sx || sy) {
      this.results.push({
        name: "transform",
        cb: props["transform"](x, y, sx, sy, c),
      });
    }

    t &&
      this.results.push({
        name: "top",
        cb: props["top"](t, c, ph),
      });

    p &&
      this.results.push({
        name: "pointerEvents",
        cb: props["pointer"](p),
      });

    d &&
      this.results.push({
        name: "display",
        cb: props["display"](d),
      });

    o &&
      this.results.push({
        name: "opacity",
        cb: props["opacity"](o, c),
      });
  } else if (this.obj) {
    for (let key in this.ps) {
      let p = this.ps[key];
      let pV = { s: p[0], lerp: p[1] - p[0] };

      this.results.push({
        name: key,
        cb: (e) => pV.s + pV.lerp * e,
      });
    }
  }
}
