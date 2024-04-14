import ease from '../../../Math/ease';
import { bounds } from '../../methods/coordinate';

/**
 * Get top function
 * @param {Array} t - top.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const top = (t, { parent, top, easing }) => {
  let tV;
  if (top === 'auto') {
    tV = {
      s: 0,
      e: t[0],
      unit: t[1] || 'px'
    };
  } else {
    const tC = parseFloat(top);
    tV = {
      s: t[1] === 'px' ? tC : (tC / bounds(parent).h) * 100,
      e: t[0],
      unit: t[1] || 'px'
    };
  }

  tV.lerp = tV.e - tV.s;
  tV.ease = t[2] ? ease(t[2]) : easing;
  return e => `${tV.s + tV.lerp * tV.ease(e)}${tV.unit}`;
};

const setValue = (e, v) => (e.style.top = v);

export default {
  cb: top,
  setValue
};
