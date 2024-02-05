import { computed } from '../../Core/methods/methods';
import ease from '../../Math/ease';

import matches from './matches';

/**
 * Get Array of properties function
 * @param {HTMLElement} e - targeted element.
 * @param {Object} ps - properties need to be modified.
 * @return {Array}
 */
function dom(e, ps) {
  const results = [];
  const compute = computed(e);
  const dir = ps.dir == -1 ? true : false;

  let easing = ps.ease;

  compute.el = e;
  compute.pa = e.parentNode;

  for (const key of Object.entries(ps)) {
    if (key[0] == 'dir') continue;
    if (key[0] == 'ease') continue;

    const values = matches(key[0]);
    const cb = values.cb(key[1], compute);
    const l = key[1].length;

    let nEase = key[1][l - 1];
    if (typeof nEase == 'object' && nEase.ease) easing = ease[nEase.ease];

    results.push({
      setV: values.setValue,
      cb: e => cb(easing(dir ? 1 - e : e))
    });
  }

  if (dir) results.map(({ setV, cb }) => setV(e, cb(0)));
  return results;
}
/**
 * Handling object tween.
 * @param {Object} e - targeted object.
 * @param {ps} ps - properties.
 */
function obj(e, ps) {
  const results = [];

  for (const key in ps) {
    const pV = { s: e[key] };

    pV.lerp = ps[key][0] - pV.s;

    results.push({
      setV: (e, v) => (e[key] = v),
      cb: e => pV.s + pV.lerp * e
    });
  }

  return results;
}

function props(e, o, ps) {
  if (!o) return dom(e, ps);
  else return obj(e, ps);
}

export default props;
