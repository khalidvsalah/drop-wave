import ease from '../../../Math/ease';

/**
 * Get circle clip-path function with computed style as starting point
 * @param {Array} circleParams - Array containing radius and position of the circle in clip-path.
 * @param {Object} computedStyle - Computed Style object containing the current clip-path parameters.
 * @return {Function}
 */

const circle = (c, { clipPath, easing }) => {
  const rMatch = clipPath.match(/circle\((.*?) at/);
  const pMath = clipPath.match(/at (.*?)\)/);

  const r = parseFloat(rMatch[1]);
  const p = pMath[1].split(' ').map(parseFloat);

  const rV = {
    s: [r, p],
    e: [parseFloat(c[0]), c[1]],
    ease: c[2] ? ease(c[2]) : easing
  };

  const RLerp = rV.e[0] - rV.s[0];
  const PXLerp = rV.e[1][0] - rV.s[1][0];
  const PYLerp = rV.e[1][1] - rV.s[1][1];

  return t => {
    const e = rV.ease(t);

    return `circle(${rV.s[0] + RLerp * e}% at ${rV.s[1][0] + PXLerp * e}% ${
      rV.s[1][1] + PYLerp * e
    }%)`;
  };
};

const setValue = (e, v) => (e.style.clipPath = v);

export default {
  cb: circle,
  setValue: setValue
};
