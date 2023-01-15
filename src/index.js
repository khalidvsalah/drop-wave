import _F from "./package/Frame.js";
import _R from "./package/Route.js";
import _C from "./package/Mount.js";
import Delay from "./package/Delay.js";
import { Ease, Clamp, Lerp } from "./package/Math.js";

const Ardor = {
  _F,
  _R,
  _C,
  Ease,
  Clamp,
  Lerp,
  Delay,
  Has: (o, p) => window.hasOwnProperty.call(o, p),
};

export default Ardor;
