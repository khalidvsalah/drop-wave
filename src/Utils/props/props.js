import { computed } from '../../Core/methods/methods';
import ease from '../../Math/ease';

import matches from './matches';

/**
 * Get Array of properties function
 * @param {HTMLElement} e - targeted element.
 * @param {Object} ps - properties need to be modified.
 * @return {Array}
 */
function dom(e, ps, results) {
  const compute = computed(e);

  let easing = ps.ease;

  compute.el = e;
  compute.pa = e.parentNode;

  for (const key of Object.entries(ps)) {
    const values = matches(key[0]);
    const cb = values.cb(key[1], compute);
    const l = key[1].length;

    let nEase = key[1][l - 1];
    if (typeof nEase == 'object' && nEase.ease) easing = ease[nEase.ease];

    results.push({ setV: values.setValue, cb: e => cb(easing(e)) });
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
    const props = { s: e[key], e: ps[key][0] };
    props.lerp = props.e - props.s;

    let nEase = ps[key][1];
    if (nEase) easing = ease[nEase.ease];

    results.push({
      setV: (e, v) => (e[key] = v),
      cb: e => props.s + props.lerp * easing(e)
    });
  }

  return results;
}

function props(e, o, ps) {
  const results = [];
  let output;

  if (!o) output = dom(e, ps, results);
  else output = obj(e, ps, results);

  return output;
}

export default props;
