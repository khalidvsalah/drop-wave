import ease from '../../../Math/ease';

/**
 * Get polygon clip-path function with computed style as starting point
 * @param {Array} polygonParams - Array containing coordinates of the polygon points.
 * @param {Object} computedStyle - Computed Style object containing the current clip-path parameters.
 * @return {Function}
 */

const points = clipPath => {
  return clipPath
    .replace(/^polygon\(|\)$/g, '')
    .split(',')
    .map(point => point.trim().split(' ').map(parseFloat));
};

const polygon = (p, { clipPath, easing }) => {
  const pV = {
    s: points(clipPath),
    e: points(p[0]),
    ease: p[1] ? ease(p[1]) : easing
  };

  pV.lerp = pV.e.map((endPoint, i) => [
    endPoint[0] - pV.s[i][0],
    endPoint[1] - pV.s[i][1]
  ]);

  return t => {
    const e = pV.ease(t);

    return `${pV.s
      .map(
        (t, i) => `${t[0] + pV.lerp[i][0] * e}% ${t[1] + pV.lerp[i][1] * e}%`
      )
      .join(', ')}`;
  };
};

const setValue = (e, v) => (e.style.clipPath = `polygon(${v})`);

export default {
  cb: polygon,
  setValue: setValue
};
