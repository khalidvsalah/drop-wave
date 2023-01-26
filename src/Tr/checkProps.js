import A from "../../index.js";
import props from "./props.js";

export default function checkProps() {
  this.results = [];

  if (A.Has(this.props, "x") || A.Has(this.props, "y")) {
    var x = A.Has(this.props, "x") && this.props["x"];
    var y = A.Has(this.props, "y") && this.props["y"];
    this.results.push({ name: "transform", cb: props["transform"](x, y) });
  }

  if (A.Has(this.props, "opacity")) {
    var o = this.props["opacity"];
    this.results.push({ name: "opacity", cb: props["opacity"](o) });
  }

  if (A.Has(this.props, "pointer")) {
    var o = this.props["pointer"];
    this.results.push({ name: "pointerEvents", cb: props["pointer"](o) });
  }
}
