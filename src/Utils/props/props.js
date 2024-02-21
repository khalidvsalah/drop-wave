import { computed } from '../../Core/methods/methods';
import ease from '../../Math/ease';

import matches from './matches';

/**
 * Get Array of properties function
 * @param {HTMLElement} e - targeted element.
 * @param {Object} ps - properties need to be modified.
 * @return {Array}
 */
function dom(e, ps, results, dir) {
  const compute = computed(e);

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

  return results;
}

/**
 * Handling object tween.
 * @param {Object} e - targeted object.
 * @param {ps} ps - properties.
 */
function obj(e, ps, results) {
  let easing = ps.ease;

  for (const key in ps) {
    if (key == 'dir') continue;
    if (key == 'ease') continue;

    const props = { s: e[key], e: ps[key][0] };
    props.lerp = props.e - props.s;

    let nEase = ps[key][1];
    if (nEase) easing = ease[nEase.ease];

    results.push({
      setV: (e, v) => (e[key] = v),
      cb: e => easing(props.s + props.lerp * e)
    });
  }

  return results;
}

function props(e, o, ps) {
  const results = [];
  const dir = ps.dir == -1 ? true : false;
  let output;

  if (!o) output = dom(e, ps, results, dir);
  else output = obj(e, ps, results, dir);

  if (dir) results.map(({ setV, cb }) => setV(e, cb(0)));

  return output;
}

export default props;
