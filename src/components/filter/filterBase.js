import { lerp } from '../../math/math';

function _blur(startValue, endValue) {
  return (t) => `blur(${lerp(startValue, endValue, t)}px)`;
}

function _gray(startValue, endValue) {
  return (t) => `grayscale(${lerp(startValue, endValue, t)}%)`;
}

function _contrast(startValue, endValue) {
  return (t) => `contrast(${lerp(startValue, endValue, t)}%)`;
}

export { _blur, _gray, _contrast };
