import Raf from "./Animation/Raf/Raf.js";
import Delay from "./Animation/Delay/Delay";

import Route from "./Core/Route/Route.js";
import Timeline from "./Core/Timeline/Timeline.js";

import Create from "./Dom/Mount/Mount";
import Events from "./Dom/Events/Events";

import { Round, Lerp, Clamp } from "./Core/Math/Math";

const Has = (o, p) => window.hasOwnProperty.call(o, p);
const ardor = {
  Raf,
  Events,
  Delay,
  Route,
  Create,
  Timeline,
  Has,
  Round,
  Lerp,
  Clamp,
};

export default ardor;
