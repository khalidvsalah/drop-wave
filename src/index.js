import Raf from "./Animation/Raf/Raf.js";
import Route from "./Core/Route/Route.js";
import Create from "./Dom/Mount/Mount";
import Timeline from "./Core/Timeline/Timeline.js";
import Delay from "./Animation/Delay/Delay";
import { Round, Lerp, Clamp } from "./Core/Math/Math";

const Has = (o, p) => window.hasOwnProperty.call(o, p);
const ardor = { Raf, Delay, Route, Create, Timeline, Has, Round, Lerp, Clamp };

export default ardor;
