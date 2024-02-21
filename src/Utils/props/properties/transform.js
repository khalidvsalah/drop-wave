const translate = (x, t, w) => {
  let xV;

  xV = {
    s: x ? (x[1] == 'px' ? t : (t / parseFloat(w)) * 100) : t,
    e: x ? x[0] : t,
    unit: x ? (x[1] ? x[1] : 'px') : 'px'
  };

  xV.lerp = xV.e - xV.s;
  return xV;
};
const scale = (sx, t) => {
  let sxV = { s: t, e: sx ? sx[0] : t };
  sxV.lerp = sxV.e - sxV.s;
  return sxV;
};
const rotate = rx => {
  const rxV = {
    s: rx ? rx[0] : 0,
    e: rx ? rx[1] : 0
  };

  rxV.lerp = rxV.e - rxV.s;
  return rxV;
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
  const props = p[0];
  const matrix = getMatrix(transform);

  const xV = translate(props.x, matrix ? +matrix[4] : 0, width);
  const yV = translate(props.y, matrix ? +matrix[5] : 0, height);

  const sxV = scale(props.sx, matrix ? +matrix[0] : 1);
  const syV = scale(props.sy, matrix ? +matrix[3] : 1);

  const rxV = rotate(props.rx);
  const ryV = rotate(props.ry);

  return e => {
    const eX = `${xV.s + xV.lerp * e}${xV.unit}`;
    const eY = `${yV.s + yV.lerp * e}${yV.unit}`;

    const eSX = `${sxV.s + sxV.lerp * e}`;
    const eSY = `${syV.s + syV.lerp * e}`;

    const eRX = `${rxV.s + rxV.lerp * e}deg`;
    const eRY = `${ryV.s + ryV.lerp * e}deg`;

    return `translate3d(${eX}, ${eY}, 0) scale(${eSX}, ${eSY}) rotateX(${eRX}) rotateY(${eRY})`;
  };
};

/*
  function transform(eX){
    return `translate3d(${eX}, ${eY}, 0)`;
  }
*/

const setValue = (e, v) => (e.style.transform = v);
export default { cb: transform, setValue };
