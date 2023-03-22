import A from "../../../../index";
import props from "./props.js";

export default function checkProps(w) {
  this.results = [];

  if (!w) {
    var x, y, o, p, d, sx, sy;

    x = A.Has(this.props, "x") && this.props["x"];
    y = A.Has(this.props, "y") && this.props["y"];

    sx = A.Has(this.props, "sx") && this.props["sx"];
    sy = A.Has(this.props, "sy") && this.props["sy"];

    o = A.Has(this.props, "opacity") && this.props["opacity"];
    p = A.Has(this.props, "pointer") && this.props["pointer"];
    d = A.Has(this.props, "display") && this.props["display"];

    this.elements.map((e) => {
      var n = window.getComputedStyle(e);

      if (x || y) {
        this.results.push({
          name: "transform",
          element: e,
          cb: props["transform"](x, y, sx, sy, n),
        });
      }

      o &&
        this.results.push({
          name: "opacity",
          element: e,
          cb: props["opacity"](o, n),
        });

      p &&
        this.results.push({
          name: "pointerEvents",
          element: e,
          cb: props["pointer"](p),
        });

      d &&
        this.results.push({
          name: "display",
          element: e,
          cb: props["display"](d),
        });
    });
  } else {
    for (let i = 0; i < this.keys.length; i++) {
      var ks = this.keys[i];
      var sP = +this.elements[0][this.keys[i]];

      this.results.push({
        name: ks,
        cb: (() => {
          var V = {
            s: sP ? sP : this.props[ks][0],
            e: this.props[ks][1],
          };
          V.lerp = this.props[ks][1] - this.props[ks][0];

          return (e) => V.s + V.lerp * e;
        })(),
      });
    }
  }
}
