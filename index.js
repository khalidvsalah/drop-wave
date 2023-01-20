import _F from "./src/Frame";
import _R from "./src/Route";
import _C from "./src/Mount";
import Delay from "./src/Delay";
import { Ease, Clamp, Lerp } from "./src/Math";
import { PrE } from "./src/Utils";

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
