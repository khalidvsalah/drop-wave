import ease from '../../../Math/ease';

/**
 * Get opacity function
 * @param {Array} o - opacity.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const alpha = (o, { opacity, easing }) => {
  const oV = {
    s: +opacity,
    e: o[0],
    ease: o[1] ? ease(o[1]) : easing
  };

  oV.lerp = oV.e - oV.s;
  return e => `${oV.s + oV.lerp * oV.ease(e)}`;
};

const setValue = (e, v) => (e.style.opacity = v);
export default { cb: alpha, setValue };
