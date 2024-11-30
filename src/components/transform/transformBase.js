import { unitConventer, getUnit, getValue } from '../../helpers/handleUnits.js';

function matrix2d(match) {
  const values = match[1].split(',').map(Number);

  const [a, b, c, d, e, f] = values;

  const translate = {
    x: e,
    y: f,
  };

  const rotation = Math.atan2(b, a);
  const rotate = {
    x: 0,
    y: 0,
    z: rotation * (180 / Math.PI),
  };

  const scale = {
    x: Math.sign(a) * Math.sqrt(a * a + b * b),
    y: Math.sign(d) * Math.sqrt(c * c + d * d),
  };

  const skew = Math.atan2(a * c + b * d, a * d - b * c) - rotation;

  return {
    translate,
    rotate,
    scale,
    skew: skew * (180 / Math.PI),
  };
}
function matrix3d(match) {
  const values = match[1].split(',').map(Number);
  const [
    m11,
    m12,
    m13,
    m14,
    m21,
    m22,
    m23,
    m24,
    m31,
    m32,
    m33,
    m34,
    m41,
    m42,
    m43,
    m44,
  ] = values;

  // Extract translation
  const translate = {
    x: m41,
    y: m42,
    z: m43,
  };

  // Extract scale and rotation
  const scale = {
    x: Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
    y: Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
    z: Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33),
  };

  const rotation = [
    [m11 / scale.x, m12 / scale.x, m13 / scale.x],
    [m21 / scale.y, m22 / scale.y, m23 / scale.y],
    [m31 / scale.z, m32 / scale.z, m33 / scale.z],
  ];

  // Convert rotation matrix to Euler angles
  const sy = Math.sqrt(
    rotation[0][0] * rotation[0][0] + rotation[1][0] * rotation[1][0]
  );
  const singular = sy < 1e-6;
  let x, y, z;
  if (!singular) {
    x = Math.atan2(rotation[2][1], rotation[2][2]);
    y = Math.atan2(-rotation[2][0], sy);
    z = Math.atan2(rotation[1][0], rotation[0][0]);
  } else {
    x = Math.atan2(-rotation[1][2], rotation[1][1]);
    y = Math.atan2(-rotation[2][0], sy);
    z = 0;
  }

  // Convert radians to degrees
  const rotate = {
    x: x * (180 / Math.PI),
    y: y * (180 / Math.PI),
    z: z * (180 / Math.PI),
  };

  // Extract skew
  // Note: CSS doesn't have a skew3d function, so we'll use individual skew operations
  const skew = {
    x: Math.atan2(rotation[1][0], rotation[0][0]) * (180 / Math.PI),
    y: Math.atan2(rotation[2][0], rotation[0][0]) * (180 / Math.PI),
    z: Math.atan2(rotation[2][1], rotation[1][1]) * (180 / Math.PI),
  };

  return { translate, rotate, scale, skew };
}

const translate = (start, end, size) => {
  const unit = end ? getUnit(end) : 'px';
  start = unitConventer(start, size, unit).value;
  const lerp = (end ? getValue(end)[0] : start) - start;
  return (t) => `${start + lerp * t}${unit}`;
};
const _translate = (start, end, [width, height]) => {
  const xfrom = Array.isArray(end[0]);
  const yfrom = Array.isArray(end[1]);

  let xV;
  let yV;

  if (xfrom) {
    xV = translate(parseFloat(end[0][0]), end[0][1], width);
  } else {
    xV = translate(start[0], end[0], width);
  }
  if (yfrom) {
    yV = translate(parseFloat(end[1][0]), end[1][1], height);
  } else {
    yV = translate(start[1], end[1], height);
  }

  return (t) => `translate3d(${xV(t)}, ${yV(t)}, 0)`;
};

const scale = (start, end) => {
  const o = { start, end: end != null ? end : start };
  o.lerp = o.end - o.start;
  return (t) => `${start + o.lerp * t}`;
};
const _scale = (start, end) => {
  const xfrom = Array.isArray(end[0]);
  const yfrom = Array.isArray(end[1]);

  let sxV;
  let syV;

  if (xfrom) {
    sxV = scale(end[0][0], end[0][1]);
  } else {
    sxV = scale(start[0], end[0]);
  }
  if (yfrom) {
    syV = scale(end[1][0], end[1][1]);
  } else {
    syV = scale(start[1], end[1]);
  }

  return (t) => `scale(${sxV(t)}, ${syV(t)})`;
};

const _rotate = (start, end) => {
  const xfrom = Array.isArray(end[0]);
  const yfrom = Array.isArray(end[1]);
  const zfrom = Array.isArray(end[2]);

  let rxV;
  let ryV;
  let rzV;

  if (xfrom) {
    rxV = scale(end[0][0], end[0][1]);
  } else {
    rxV = scale(start[0], end[0]);
  }
  if (yfrom) {
    ryV = scale(end[1][0], end[1][1]);
  } else {
    ryV = scale(start[1], end[1]);
  }
  if (zfrom) {
    rzV = scale(end[2][0], end[2][1]);
  } else {
    rzV = scale(start[2], end[2]);
  }

  return (t) =>
    `rotate(${rzV(t)}deg) rotateX(${rxV(t)}deg) rotateY(${ryV(t)}deg)`;
};

export { matrix2d, matrix3d, _translate, _scale, _rotate };
