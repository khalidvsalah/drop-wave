import { lerp } from '../../math/math.js';
import { unitConventer, getUnit, getValue } from '../../helpers/handleUnits.js';

const translate = (endValue, startValue, size) => {
  const unit = getUnit(endValue) || 'px';
  startValue = unitConventer(startValue || 0, size, unit).value;
  endValue = getValue(endValue) || 0;
  return (t) => `${lerp(startValue, endValue, t)}${unit}`;
};
const _translate = (endValue, startValue, [width, height]) => {
  const xV = translate(endValue[0], startValue[0], width);
  const yV = translate(endValue[1], startValue[1], height);
  return (t) => `translate3d(${xV(t)}, ${yV(t)}, 0)`;
};

const scale = (endValue, startValue) => {
  startValue = startValue || 1;
  endValue = endValue || 1;
  return (t) => `${lerp(startValue, endValue, t)}`;
};
const _scale = (endValue, startValue) => {
  const sxV = scale(endValue[0], startValue[0]);
  const syV = scale(endValue[1], startValue[1]);
  return (t) => `scale(${sxV(t)}, ${syV(t)})`;
};

const rotate = (endValue, startValue) => {
  startValue = startValue || 0;
  endValue = endValue || 0;
  return (t) => `${lerp(startValue, endValue, t)}`;
};
const _rotate = (endValue, startValue) => {
  const rxV = rotate(endValue[0], startValue[0]);
  const ryV = rotate(endValue[1], startValue[1]);
  const rzV = rotate(endValue[2], startValue[2]);
  return (t) =>
    `rotate(${rzV(t)}deg) rotateX(${rxV(t)}deg) rotateY(${ryV(t)}deg)`;
};

export { _translate, _scale, _rotate };
