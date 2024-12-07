import { lerp } from '../../math/math.js';
import { unitConventer, getUnit, getValue } from '../../helpers/handleUnits.js';

const translate = (endValue, startValue, size) => {
  const unit = getUnit(endValue) || 'px';
  startValue = unitConventer(startValue || 0, size, unit).value;
  endValue = getValue(endValue) || 0;
  return (t) => `${lerp(startValue, endValue, t)}${unit}`;
};
const _translate = (endValue, startValue, [width, height]) => {
  let xV;
  let yV;

  xV = translate(endValue[0], startValue[0], width);
  yV = translate(endValue[1], startValue[1], height);

  return (t) => `translate3d(${xV(t)}, ${yV(t)}, 0)`;
};

const scale = (endValue, startValue) => {
  startValue = startValue || 1;
  endValue = endValue || 1;
  return (t) => `${lerp(startValue, endValue, t)}`;
};
const _scale = (endValue, startValue) => {
  let sxV;
  let syV;

  sxV = scale(endValue[0], startValue[0]);
  syV = scale(endValue[1], startValue[1]);

  return (t) => `scale(${sxV(t)}, ${syV(t)})`;
};

const _rotate = (endValue, startValue) => {
  console.log(endValue, startValue);

  let rxV;
  let ryV;
  let rzV;

  // rxV = scale(endValue[0], startValue[0]);
  // ryV = scale(endValue[1], startValue[1]);
  // rzV = scale(endValue[2], startValue[2]);

  // return (t) =>
  //   `rotate(${rzV(t)}deg) rotateX(${rxV(t)}deg) rotateY(${ryV(t)}deg)`;
};

export { _translate, _scale, _rotate };
