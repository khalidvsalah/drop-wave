const translateX = (p, t, w) => {
  const x = p.x;
  const value = t ? +t[4] : 0;
  let xV;

  if (t) {
    xV = {
      s: x ? (x[1] === 'px' ? value : (value / parseFloat(w)) * 100) : value,
      e: x ? x[0] : value
    };
  } else {
    xV = {
      s: 0,
      e: x ? x[0] : 0
    };
  }

  xV.lerp = xV.e - xV.s;
  xV.unit = x ? (x[1] ? x[1] : 'px') : 'px';

  return xV;
};
const translateY = (p, t, h) => {
  const y = p.y;
  const value = t ? +t[5] : 0;
  let yV;

  if (t) {
    yV = {
      s: y ? (y[1] === 'px' ? value : (value / parseFloat(h)) * 100) : value,
      e: y ? y[0] : value
    };
  } else {
    yV = {
      s: 0,
      e: y ? y[0] : 0
    };
  }

  yV.lerp = yV.e - yV.s;
  yV.unit = y ? (y[1] ? y[1] : 'px') : 'px';

  return yV;
};

const scaleX = (p, t) => {
  const sx = p.sx;
  let sxV;

  if (t) sxV = { s: +t[0], e: sx ? sx[0] : +t[0] };
  else sxV = { s: 1, e: sx ? sx[0] : 1 };

  sxV.lerp = sxV.e - sxV.s;

  return sxV;
};
const scaleY = (p, t) => {
  const sy = p.sy;
  let syV;

  if (t) syV = { s: +t[3], e: sy ? sy[0] : +t[3] };
  else syV = { s: 1, e: sy ? sy[0] : 1 };

  syV.lerp = syV.e - syV.s;

  return syV;
};

const rotateX = (p) => {
  const rx = p.rx;
  const rxV = {
    s: rx ? rx[0] : 0,
    e: rx ? rx[1] : 0
  };

  rxV.lerp = rxV.e - rxV.s;

  return rxV;
};
const rotateY = (p) => {
  const ry = p.ry;
  const ryV = {
    s: ry ? ry[0] : 0,
    e: ry ? ry[1] : 0
  };

  ryV.lerp = ryV.e - ryV.s;

  return ryV;
};

const getMatrix = (t) => {
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

  const xV = translateX(p, matrix, width);
  const yV = translateY(p, matrix, height);

  const sxV = scaleX(p, matrix);
  const syV = scaleY(p, matrix);

  const rxV = rotateX(p, matrix);
  const ryV = rotateY(p, matrix);

  return (e) => {
    const eX = `${xV.s + xV.lerp * e}${xV.unit}`;
    const eY = `${yV.s + yV.lerp * e}${yV.unit}`;

    const eSX = `${sxV.s + sxV.lerp * e}`;
    const eSY = `${syV.s + syV.lerp * e}`;

    const eRX = `${rxV.s + rxV.lerp * e}deg`;
    const eRY = `${ryV.s + ryV.lerp * e}deg`;

    return `translate(${eX}, ${eY}) scale(${eSX}, ${eSY}) rotateX(${eRX}) rotateY(${eRY})`;
  };
};

const setValue = (e, v) => (e.style.transform = v);

export default {
  cb: transform,
  setValue
};
