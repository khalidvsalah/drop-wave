/**
 * Get blur function
 * @param {Array} b - blur.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const blur = (b, c) => {
  let bV;

  if (c.filter === 'none') {
    bV = {
      s: 0,
      e: b[0]
    };
  } else {
    bV = {
      s: +c.filter.match(/(\d.*)px/)[1],
      e: b[0]
    };
  }

  bV.lerp = bV.e - bV.s;
  return (e) => bV.s + bV.lerp * e;
};

const setValue = (e, v) => (e.style.filter = `blur(${v}px)`);

export default {
  cb: blur,
  setValue
};
