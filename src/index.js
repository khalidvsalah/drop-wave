import _F from "./package/Frame.js";
import _R from "./package/Route.js";
import _C from "./package/Mount.js";
import { Ease, Clamp, Lerp } from "./package/Math.js";

const Ardor = {
  _F,
  _R,
  _C,
  Ease,
  Clamp,
  Lerp,
  has: (o, p) => window.hasOwnProperty.call(o, p),
};

export default Ardor;
