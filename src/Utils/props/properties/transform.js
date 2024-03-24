import ease from '../../../Math/ease';

const translate = (x, t, w, easing) => {
  let xV = {
    s: x ? (x[1] == 'px' ? t : (t / parseFloat(w)) * 100) : t,
    e: x ? x[0] : t,
    unit: x ? (x[1] ? x[1] : 'px') : 'px'
  };
  xV.lerp = xV.e - xV.s;
  if (x) xV.ease = x[2] ? ease(x[2]) : easing;
  else xV.ease = ease('l');

  return e => `${xV.s + xV.lerp * xV.ease(e)}${xV.unit}`;
};
const scale = (sx, t, easing) => {
  let sxV = { s: t, e: sx ? sx[0] : t };
  sxV.lerp = sxV.e - sxV.s;
  if (sx) sxV.ease = sx[1] ? ease(sx[1]) : easing;
  else sxV.ease = ease('l');
  return e => `${sxV.s + sxV.lerp * sxV.ease(e)}`;
};
const rotate = (rx, easing) => {
  const rxV = {
    s: rx ? rx[0] : 0,
    e: rx ? rx[1] : 0
  };
  rxV.lerp = rxV.e - rxV.s;
  if (rx) rxV.ease = rx[1] ? ease(rx[1]) : easing;
  else rxV.ease = ease('l');

  return e => `${rxV.s + rxV.lerp * rxV.ease(e)}deg`;
};
const getMatrix = t => {
  const matrix3D = t.match(/^matrix3d\((.+)\)$/);
  let matrix = t.match(/\((.+)\)$/);

  if (matrix3D) {
    matrix = matrix3D[1].split(', ');

    matrix = [
      matrix[0],
      matrix[1],
      matrix[4],
      matrix[5],
      matrix[12],
      matrix[13]
    ];
  } else if (matrix) {
    matrix = matrix[1].split(', ');
  }

  return matrix;
};

/**
 * Handing transform properties animation
 *
 * @param {Object} p - transform properties animation end ponit .
 * @param {Object} transform - Computed Style.
 * @return {Function}
 */
const transform = (p, { transform, width, height, easing }) => {
  const matrix = getMatrix(transform);

  const xV = translate(p.x, matrix ? +matrix[4] : 0, width, easing);
  const yV = translate(p.y, matrix ? +matrix[5] : 0, height, easing);

  const sxV = scale(p.sx, matrix ? +matrix[0] : 1, easing);
  const syV = scale(p.sy, matrix ? +matrix[3] : 1, easing);

  const rxV = rotate(p.rx, easing);
  const ryV = rotate(p.ry, easing);

  return e => {
    return `translate3d(${xV(e)}, ${yV(e)}, 0) 
    scale(${sxV(e)}, ${syV(e)}) 
    rotateX(${rxV(e)}) rotateY(${ryV(e)})`;
  };
};

const setValue = (e, v) => (e.style.transform = v);
export default { cb: transform, setValue };
