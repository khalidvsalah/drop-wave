/**
 * @param {object} p - filter.
 * @param {object} info - computed style.
 * @return {Function}
 */
function filter(p, { computed }) {
  const start = computed.filter;

  const blur = /blur\((.*)px\)/.exec(start);
  const gray = /grayscale\((.*)\)/.exec(start);
  const contrast = /contrast\((.*)\)/.exec(start);

  const arrs = [];

  for (const key in p) {
    if (key === 'blur' || blur) {
      const o = {
        start: blur ? +blur[1] : 0,
        end: parseFloat(p.blur)
      };
      o.lerp = o.end - o.start;
      arrs.push(t => `blur(${o.start + o.lerp * t}px)`);
    }
    if (key === 'gray' || gray) {
      const o = {
        start: (gray ? +gray[1] : 0) * 100,
        end: parseFloat(p.gray || 0)
      };
      o.lerp = o.end - o.start;
      arrs.push(t => `grayscale(${o.start + o.lerp * t}%)`);
    }
    if (key === 'contrast' || contrast) {
      const o = {
        start: (contrast ? +contrast[1] : 0) * 100,
        end: parseFloat(p.contrast || 0)
      };
      o.lerp = o.end - o.start;
      arrs.push(t => `contrast(${o.start + o.lerp * t}%)`);
    }
  }

  return t => arrs.map(arr => arr(t)).join(' ');
}

const setValue = element => value => (element.style.filter = value);
export default { callback: filter, setValue };
