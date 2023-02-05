import _F from "./src/timeline/frame/Frame.js";
import _R from "./src/route/Route.js";
import _C from "./src/mount/Mount.js";
import Delay from "./src/timeline/delay/Delay.js";
import TL from "./src/timeline/timeline.js";
import { Ease, Clamp, Lerp } from "./src/utils/Math.js";
import { PrE } from "./src/utils/Utils.js";

const Ardor = {
  _F,
  _R,
  _C,
  Ease,
  Clamp,
  Lerp,
  Delay,
  TL,
  PrE,
  Has: (o, p) => window.hasOwnProperty.call(o, p),
};

export default Ardor;
