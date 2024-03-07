import ease from '../../../Math/ease';

/**
 * Get blur function
 * @param {Array} b - blur.
 * @param {Object} n - Computed Style.
 * @return {Function}
 */
const blur = (b, { filter }) => {
  let bV;

  if (filter === 'none') {
    bV = {
      s: 0,
      e: b[0]
    };
  } else {
    bV = {
      s: +filter.match(/(\d.*)px/)[1],
      e: b[0]
    };
  }

  bV.lerp = bV.e - bV.s;
  bV.ease = ease(b[1]);

  return e => bV.s + bV.lerp * bV.ease(e);
};

const setValue = (e, v) => (e.style.filter = `blur(${v}px)`);
export default { cb: blur, setValue };
