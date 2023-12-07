/**
 * Get opacity function
 * @param {Array} o - opacity.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const alpha = (o, n) => {
  const oV = {
    s: +n.opacity,
    e: o[0]
  };

  oV.lerp = oV.e - oV.s;
  return (e) => `${oV.s + oV.lerp * e}`;
};

const setValue = (e, v) => (e.style.opacity = v);

export default {
  cb: alpha,
  setValue
};
