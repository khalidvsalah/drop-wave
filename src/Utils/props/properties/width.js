import ease from '../../../Math/ease';

/**
 * Get width function
 * @param {Array} w - width.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const width = (w, { pa, width }) => {
  const parse = parseFloat(width);
  const wV = {
    s: w[1] === 'px' ? parse : (parse / pa.clientWidth) * 100,
    e: w[0],
    unit: w[1] === 'px' ? 'px' : '%',
    ease: ease(w[2])
  };

  wV.lerp = wV.e - wV.s;
  return e => `${wV.s + wV.lerp * wV.ease(e)}${wV.unit}`;
};

const setValue = (e, v) => (e.style.width = v);

export default {
  cb: width,
  setValue
};
