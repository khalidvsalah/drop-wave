import { _blur, _gray, _contrast } from './filterBase';

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
 */
function filter(target, { computed }) {
  const start = computed.filter;

  const blur = /blur\((.*)px\)/.exec(start);
  const gray = /grayscale\((.*)\)/.exec(start);
  const contrast = /contrast\((.*)\)/.exec(start);

  const arrs = [];

  for (const key in target) {
    if (key === 'blur' || blur) {
      const b = target.blur;
      const bfrom = Array.isArray(b);
      arrs.push(_blur(bfrom ? b[0] : blur ? +blur[1] : 0, bfrom ? b[1] : b));
    }
    if (key === 'gray' || gray) {
      const g = target.gray;
      const gfrom = Array.isArray(g);
      arrs.push(
        _gray(gfrom ? g[0] : (gray ? +gray[1] : 0) * 100, gfrom ? g[1] : g)
      );
    }
    if (key === 'contrast' || contrast) {
      const c = target.contrast;
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

export default {
  name: 'filter',
  callback: filter,
};
