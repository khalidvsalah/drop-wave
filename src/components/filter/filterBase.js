import { lerp } from '../../math/math';

function _blur(start, end) {
  const o = { start: parseFloat(start), end: parseFloat(end) };
  return (t) => `blur(${lerp(o.start, o.end, t)}px)`;
}

function _gray(start, end) {
  const o = { start: parseFloat(start), end: parseFloat(end) };
  return (t) => `grayscale(${lerp(o.start, o.end, t)}%)`;
}

function _contrast(start, end) {
  const o = { start: parseFloat(start), end: parseFloat(end) };
  return (t) => `contrast(${lerp(o.start, o.end, t)}%)`;
}

export { _blur, _gray, _contrast };
