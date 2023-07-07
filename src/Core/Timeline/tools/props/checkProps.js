import props from "./props.js";

export default function checkProps() {
  this.results = [];

  if (this.ps && !this.obj) {
    let x, y, o, sx, sy;

    let ele = this.target;
    let computed = window.getComputedStyle(ele);

    x = this.ps["x"] || false;
    y = this.ps["y"] || false;

    sx = this.ps["sx"] || false;
    sy = this.ps["sy"] || false;

    o = this.ps["opacity"] || false;

    if (x || y || sx || sy) {
      this.results.push({
        name: "transform",
        cb: props["transform"](x, y, sx, sy, computed),
      });
    }

    if (o) {
      this.results.push({ name: "opacity", cb: props["opacity"](o, computed) });
    }
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
