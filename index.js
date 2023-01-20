import _F from "./src/Frame.js";
import _R from "./src/Route.js";
import _C from "./src/Mount.js";
import Delay from "./src/Delay.js";
import { Ease, Clamp, Lerp } from "./src/Math.js";
import { PrE } from "./src/Utils.js";

const Ardor = {
  _F,
  _R,
  _C,
  Ease,
  Clamp,
  Lerp,
  Delay,
  PrE,
  Has: (o, p) => window.hasOwnProperty.call(o, p),
};

export default Ardor;
