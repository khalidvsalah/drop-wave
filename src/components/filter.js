function _blur(start, end) {
  const o = {
    start: parseFloat(start),
    end: parseFloat(end),
  };
  o.lerp = o.end - o.start;
  return (t) => `blur(${o.start + o.lerp * t}px)`;
}
function _gray(start, end) {
  const o = {
    start: parseFloat(start),
    end: parseFloat(end),
  };
  o.lerp = o.end - o.start;
  return (t) => `grayscale(${o.start + o.lerp * t}%)`;
}
function _contrast(start, end) {
  const o = {
    start: parseFloat(start),
    end: parseFloat(end),
  };
  o.lerp = o.end - o.start;
  return (t) => `contrast(${o.start + o.lerp * t}%)`;
}

/**
 * @param {object} p - filter.
 * @param {object} info - {computed, element, parent}.
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
      const b = p.blur;
      const bfrom = Array.isArray(b);
      arrs.push(_blur(bfrom ? b[0] : blur ? +blur[1] : 0, bfrom ? b[1] : b));
    }
    if (key === 'gray' || gray) {
      const g = p.gray;
      const gfrom = Array.isArray(g);
      arrs.push(
        _gray(gfrom ? g[0] : (gray ? +gray[1] : 0) * 100, gfrom ? g[1] : g)
      );
    }
    if (key === 'contrast' || contrast) {
      const c = p.contrast;
      const cfrom = Array.isArray(c);
      arrs.push(
        _contrast(
          cfrom ? c[0] : (contrast ? +contrast[1] : 0) * 100,
          cfrom ? c[1] : c
        )
      );
    }
  }

  return (t) => arrs.map((arr) => arr(t)).join(' ');
}

export default filter;
