function matrix2d(match) {
  const values = match[1].split(',').map(Number);

  const [a, b, c, d, tx, ty] = values;

  // Translation (tx, ty)
  const translate = { x: tx, y: ty };

  // Rotation (using atan2)
  const rotation = Math.atan2(b, a); // rotation angle in radians
  const rotate = {
    x: 0,
    y: 0,
    z: ((rotation * (180 / Math.PI) * 1000) >> 0) / 1000, // convert to degrees
  };

  // Scale (magnitude of vectors (a, b) and (c, d))
  const scaleX = ((Math.sqrt(a * a + b * b) * 1000) >> 0) / 1000;
  const scaleY = ((Math.sqrt(c * c + d * d) * 1000) >> 0) / 1000;
  const scale = { x: scaleX, y: scaleY };

  // Skew - assume no skew in this case (since it's not part of the input)
  const skew = 0;

  return {
    translate,
    rotate,
    scale,
    skew,
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

export { matrix2d, matrix3d };
