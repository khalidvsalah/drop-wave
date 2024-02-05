import { bounds } from '../../../Core/methods/methods';

/**
 * Get top function
 * @param {Array} t - top.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const top = (t, c) => {
  let tV;
  if (c.top === 'auto') {
    tV = {
      s: 0,
      e: t[0],
      unit: t[1] || 'px'
    };
  } else {
    const tC = parseFloat(c.top);
    tV = {
      s: t[1] === 'px' ? tC : (tC / bounds(c.pa).h) * 100,
      e: t[0],
      unit: t[1] || 'px'
    };
  }

  tV.lerp = tV.e - tV.s;
  return e => `${tV.s + tV.lerp * e}${tV.unit}`;
};

const setValue = (e, v) => (e.style.top = v);

export default {
  cb: top,
  setValue
};
