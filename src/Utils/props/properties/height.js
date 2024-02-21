import ease from '../../../Math/ease';

/**
 * Get width function
 * @param {Array} h - height.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const height = (h, { pa, height }) => {
  const parse = parseFloat(height);

  const hV = {
    s: h[1] === 'px' ? parse : (parse / pa.clientHeight) * 100,
    e: h[0],
    unit: h[1] === 'px' ? 'px' : '%',
    ease: ease[h[2]]
  };

  hV.lerp = hV.e - hV.s;
  return e => `${hV.s + hV.lerp * hV.ease(e)}${hV.unit}`;
};

const setValue = (e, v) => (e.style.height = v);

export default {
  cb: height,
  setValue
};
