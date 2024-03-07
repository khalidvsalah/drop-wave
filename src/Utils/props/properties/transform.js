import ease from '../../../Math/ease';

const translate = (x, t, w) => {
  let xV = {
    s: x ? (x[1] == 'px' ? t : (t / parseFloat(w)) * 100) : t,
    e: x ? x[0] : t,
    unit: x ? (x[1] ? x[1] : 'px') : 'px'
  };
  xV.lerp = xV.e - xV.s;
  if (x) xV.ease = ease(x[2]);
  else xV.ease = ease('l');

  return e => `${xV.s + xV.lerp * xV.ease(e)}${xV.unit}`;
};
const scale = (sx, t) => {
  let sxV = { s: t, e: sx ? sx[0] : t };
  sxV.lerp = sxV.e - sxV.s;
  if (sx) sxV.ease = ease(sx[1]);
  else sxV.ease = ease('l');
  return e => `${sxV.s + sxV.lerp * sxV.ease(e)}`;
};
const rotate = rx => {
  const rxV = {
    s: rx ? rx[0] : 0,
    e: rx ? rx[1] : 0
  };
  rxV.lerp = rxV.e - rxV.s;
  if (rx) rxV.ease = ease(rx[1]);
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
const transform = (p, { transform, width, height }) => {
  const matrix = getMatrix(transform);

  const xV = translate(p.x, matrix ? +matrix[4] : 0, width);
  const yV = translate(p.y, matrix ? +matrix[5] : 0, height);

  const sxV = scale(p.sx, matrix ? +matrix[0] : 1);
  const syV = scale(p.sy, matrix ? +matrix[3] : 1);

  const rxV = rotate(p.rx);
  const ryV = rotate(p.ry);

  return e => {
    return `translate3d(${xV(e)}, ${yV(e)}, 0) 
    scale(${sxV(e)}, ${syV(e)}) 
    rotateX(${rxV(e)}) rotateY(${ryV(e)})`;
  };
};

const setValue = (e, v) => (e.style.transform = v);
export default { cb: transform, setValue };
