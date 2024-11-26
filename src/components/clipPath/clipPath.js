import { _circle, _polygon } from './clipPathBase';

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
 */
function clipPath(target, { computed }) {
  const isCircle = target.circle;
  const isPolygon = target.polygon;

  let start = computed.clipPath;

  if (isCircle) {
    if (start === 'none') start = '100 at 50 50';

    const from = Array.isArray(isCircle);
    const circle = _circle(
      from ? isCircle[0] : start,
      from ? isCircle[1] : isCircle
    );

    return (t) => `circle(${circle(t)})`;
  }

  if (isPolygon) {
    if (start === 'none') start = 'polygon(0 0, 100 0, 100 100, 0 100)';

    const from = Array.isArray(isPolygon);
    const polygon = _polygon(
      from ? isPolygon[0] : start,
      from ? isPolygon[1] : isPolygon
    );

    return (t) => `polygon(${polygon(t)})`;
  }
}

export default {
  name: 'clipPath',
  callback: clipPath,
};
