import _F from "./Frame.js";

export default function Delay({ delay, cb }) {
  return _F.push({ completed: cb, d: delay });
}
