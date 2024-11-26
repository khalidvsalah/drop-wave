import { lerp } from '../../math/math';

function interpolatePoints(start, end) {
  const results = [];

  const sLength = start.length;
  const eLength = end.length;

  if (sLength < eLength) end = start;

  let length = Math.max(sLength, eLength);
  const segments = Math.min(sLength, eLength);

  for (let i = 0; i < segments; i++) {
    const vertices = Math.ceil(length / (segments - i));
    const [startX, startY] = end[i];
    const [endX, endY] = end[i + 1] || end[0];

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
