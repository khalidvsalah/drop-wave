import A from "../../../index.js";
import props from "./props.js";

export default function checkProps(w) {
  this.results = [];
  if (!w) {
    var n = window.getComputedStyle(this.element);

    if (A.Has(this.props, "x") || A.Has(this.props, "y")) {
      var x = A.Has(this.props, "x") && this.props["x"];
      var y = A.Has(this.props, "y") && this.props["y"];
      this.results.push({
        name: "transform",
        cb: props["transform"](x, y, n),
      });
    }

    if (A.Has(this.props, "opacity")) {
      var o = this.props["opacity"];
      this.results.push({ name: "opacity", cb: props["opacity"](o, n) });
    }

    if (A.Has(this.props, "pointer")) {
      var o = this.props["pointer"];
      this.results.push({ name: "pointerEvents", cb: props["pointer"](o) });
    }

    if (A.Has(this.props, "display")) {
      var o = this.props["display"];
      this.results.push({ name: "display", cb: props["display"](o) });
    }
  } else {
    for (let i = 0; i < this.keys.length; i++) {
      var ks = this.keys[i];
      this.results.push({
        name: ks,
        cb: (() => {
          var V = {
            s: this.props[ks][0],
            e: this.props[ks][1],
            lerp: this.props[ks][1] - this.props[ks][0],
          };

          return (e) => V.s + V.lerp * e;
        })(),
      });
    }
  }
}
