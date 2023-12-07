/**
 * Get width function
 * @param {Array} w - width.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const width = (w, n) => {
  const parse = parseFloat(n.width);
  const wV = {
    s: w[1] === 'px' ? parse : (parse / n.pa.clientWidth) * 100,
    e: w[0],
    unit: w[1] === 'px' ? 'px' : '%'
  };

  wV.lerp = wV.e - wV.s;

  return (e) => `${wV.s + wV.lerp * e}${wV.unit}`;
};

const setValue = (e, v) => (e.style.width = v);

export default {
  cb: width,
  setValue
};
