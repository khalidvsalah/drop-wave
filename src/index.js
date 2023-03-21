import Raf from "./timeline/frame/Frame.js";
import Route from "./route/Route.js";
import Create from "./mount/Mount.js";
import Timeline from "./timeline/timeline.js";
import { Round, Lerp, Clamp } from "./utils/math/Math";

const Has = (o, p) => window.hasOwnProperty.call(o, p);
const ardor = { Raf, Route, Create, Timeline, Has, Round, Lerp, Clamp };

export default ardor;
