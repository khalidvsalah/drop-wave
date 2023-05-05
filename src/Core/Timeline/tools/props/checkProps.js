import { Has } from "../../../../index";
import props from "./props.js";

export default function checkProps(w) {
  this.results = [];
  this.startPoint = this.props;

  if (!w) {
    let x, y, o, p, d, sx, sy, t, l, b, r;

    x = Has(this.props, "x") && this.props["x"];
    y = Has(this.props, "y") && this.props["y"];

    sx = Has(this.props, "sx") && this.props["sx"];
    sy = Has(this.props, "sy") && this.props["sy"];

    t = Has(this.props, "t") && this.props["t"];
    // l = Has(this.props, "l") && this.props["l"];

    // b = Has(this.props, "b") && this.props["b"];
    // r = Has(this.props, "r") && this.props["r"];

    o = Has(this.props, "opacity") && this.props["opacity"];
    p = Has(this.props, "pointer") && this.props["pointer"];
    d = Has(this.props, "display") && this.props["display"];

    this.elements.map((e) => {
      var n = window.getComputedStyle(e);
      // var eH = e.clientHeight;
      // var eW = e.clientWidth;
      var pH = e.parentNode.clientHeight;
      // var pW = e.parentNode.clientWidth;

      if (x || y || sx || sy) {
        this.results.push({
          name: "transform",
          element: e,
          cb: props["transform"](x, y, sx, sy, n, this.startPoint),
        });
      }

      t &&
        this.results.push({
          name: "top",
          element: e,
          cb: props["top"](t, n, pH, this.startPoint),
        });

      // b &&
      //   this.results.push({
      //     name: "bottom",
      //     element: e,
      //     cb: props["bottom"](b, n, pH),
      //   });

      // l &&
      //   this.results.push({
      //     name: "left",
      //     element: e,
      //     cb: props["left"](l, n, pW),
      //   });

      // r &&
      //   this.results.push({
      //     name: "right",
      //     element: e,
      //     cb: props["right"](r, n, pW),
      //   });

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

      o &&
        this.results.push({
          name: "opacity",
          element: e,
          cb: props["opacity"](o, n, this.startPoint),
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
