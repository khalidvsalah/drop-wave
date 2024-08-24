function matrix2d(match) {
  // Extract the 6 values from the matrix string
  const values = match[1].split(',').map(Number);

  // Extract individual matrix components
  const [a, b, c, d, e, f] = values;

  // Calculate translation
  const translate = {
    x: e,
    y: f
  };

  // Calculate rotation (in radians, then converted to degrees)
  const rotation = Math.atan2(b, a);
  const rotate = {
    x: 0,
    y: 0,
    z: rotation * (180 / Math.PI)
  };

  // Calculate scale
  const scale = {
    x: Math.sign(a) * Math.sqrt(a * a + b * b),
    y: Math.sign(d) * Math.sqrt(c * c + d * d)
  };

  // Calculate skew
  // The skew is the difference between the rotation angles of the two axes
  const skew = Math.atan2(a * c + b * d, a * d - b * c) - rotation;

  return {
    translate,
    rotate,
    scale,
    skew: skew * (180 / Math.PI) // Convert skew to degrees
  };
}
function matrix3d(match) {
  // Extract the 16 values from the matrix3d string
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
    m44
  ] = values;

  // Extract translation
  const translate = {
    x: m41,
    y: m42,
    z: m43
  };

  // Extract scale and rotation
  const scale = {
    x: Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
    y: Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
    z: Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
  };

  const rotation = [
    [m11 / scale.x, m12 / scale.x, m13 / scale.x],
    [m21 / scale.y, m22 / scale.y, m23 / scale.y],
    [m31 / scale.z, m32 / scale.z, m33 / scale.z]
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
    z: z * (180 / Math.PI)
  };

  // Extract skew
  // Note: CSS doesn't have a skew3d function, so we'll use individual skew operations
  const skew = {
    x: Math.atan2(rotation[1][0], rotation[0][0]) * (180 / Math.PI),
    y: Math.atan2(rotation[2][0], rotation[0][0]) * (180 / Math.PI),
    z: Math.atan2(rotation[2][1], rotation[1][1]) * (180 / Math.PI)
  };

  return { translate, rotate, scale, skew };
}

const translate = (start, end, size) => {
  const split = end ? /(\d+)(%|px)?/.exec(end) : end;
  size = parseFloat(size);

  const o = {
    start: end ? (split[2] === 'px' ? start : (start / size) * 100) : start,
    end: end ? +split[1] : start,
    unit: end ? split[2] || 'px' : 'px'
  };
  o.lerp = o.end - o.start;
  return t => `${o.start + o.lerp * t}${o.unit}`;
};
const _translate = (start, end, [width, height]) => {
  const xV = translate(start[0], end[0], width);
  const yV = translate(start[1], end[1], height);
  return t => `translate3d(${xV(t)}, ${yV(t)}, 0)`;
};
const scale = (start, end) => {
  const o = {
    start,
    end: end || start
  };
  o.lerp = o.end - o.start;
  return t => `${start + o.lerp * t}`;
};
const _scale = (start, end) => {
  const sxV = scale(start[0], end[0]);
  const syV = scale(start[1], end[1]);
  return t => `scale(${sxV(t)}, ${syV(t)})`;
};

const _rotate = (start, end) => {
  const rxV = scale(start[0], end[0]);
  const ryV = scale(start[1], end[1]);
  const rzV = scale(start[2], end[2]);

  return t =>
    `rotate(${rzV(t)}deg) rotateX(${rxV(t)}deg) rotateY(${ryV(t)}deg)`;
};

/**
 * @param {object} p - transform properties animation end ponit .
 * @param {object}
 * @return {(t:number)=> string}
 */
const transform = (p, { computed }) => {
  let startPoint = computed.transform;

  const width = computed.width;
  const height = computed.height;

  if (startPoint !== 'none') {
    const isMatrix3d = /3d/.exec(startPoint);
    const matrix = /\((.*)\)/.exec(startPoint);

    if (isMatrix3d) {
      startPoint = matrix3d(matrix);
    } else {
      startPoint = matrix2d(matrix);
    }
  } else {
    startPoint = {
      translate: { x: 0, y: 0 },
      scale: { x: 0, y: 0 },
      rotate: { x: 0, y: 0, z: 0 }
    };
  }

  if (p.scale) [p.scaleX, p.scaleY] = [p.scale, p.scale];
  if (p.rotate) p.rotateZ = p.rotate;

  const arr = [];

  if (p.x || p.y || startPoint.translate.x || startPoint.translate.y) {
    const start = startPoint
      ? [startPoint.translate.x, startPoint.translate.y]
      : [0, 0];
    arr.push(_translate(start, [p.x, p.y], [width, height]));
  }
  if (p.scaleX || p.scaleY || startPoint.scale.x || startPoint.scale.y) {
    const start = startPoint
      ? [startPoint.scale.x, startPoint.scale.y]
      : [1, 1];
    arr.push(_scale(start, [p.scaleX, p.scaleY]));
  }
  if (
    p.rotateX ||
    p.rotateY ||
    p.rotateZ ||
    startPoint.rotate.x ||
    startPoint.rotate.y ||
    startPoint.rotate.z
  ) {
    const start = startPoint
      ? [startPoint.rotate.x, startPoint.rotate.y, startPoint.rotate.z]
      : [0, 0, 0];
    arr.push(_rotate(start, [p.rotateX, p.rotateY, p.rotateZ]));
  }

  return t => arr.map(a => a(t)).join(' ');
};

const setValue = element => value => (element.style.transform = value);
export default { callback: transform, setValue };
