/**
 * Get width function
 * @param {Array} h - height.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const height = (h, n) => {
  const parse = parseFloat(n.height);

  const hV = {
    s: h[1] === 'px' ? parse : (parse / n.pa.clientHeight) * 100,
    e: h[0],
    unit: h[1] === 'px' ? 'px' : '%'
  };

  hV.lerp = hV.e - hV.s;
  return (e) => `${hV.s + hV.lerp * e}${hV.unit}`;
};

const setValue = (e, v) => (e.style.height = v);

export default {
  cb: height,
  setValue
};
