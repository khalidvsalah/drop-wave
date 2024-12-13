import { lerp } from '../../math/math';

function interpolatePoints(endValue, startValue) {
  const results = [];

  const sLength = endValue.length;
  const eLength = startValue.length;

  if (sLength < eLength) startValue = endValue;

  let length = Math.max(sLength, eLength);
  const segments = Math.min(sLength, eLength);

  for (let i = 0; i < segments; i++) {
    const vertices = Math.ceil(length / (segments - i));
    const [startX, startY] = startValue[i];
    const [endX, endY] = startValue[i + 1] || startValue[0];

    for (let k = 0; k < vertices; k++) {
      const map = k / (vertices - 1) || 0;
      const x = lerp(+startX, +endX, map);
      const y = lerp(+startY, +endY, map);
      results.push([x, y]);
    }

    length -= vertices;
  }

  return results;
}

export { interpolatePoints };
