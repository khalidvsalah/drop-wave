import { computed } from '../../Core/methods/methods';
import matches from './matches';

/**
 * Get Array of properties function
 * @param {HTMLElement} e - targeted element.
 * @param {Object} ps - properties need to be modified.
 * @return {Array}
 */
function dom(e, ps, results) {
  const compute = computed(e);
  compute.el = e;
  compute.pa = e.parentNode;

  for (const key of Object.entries(ps)) {
    const values = matches(key[0]);
    const cb = values.cb(key[1], compute);
    results.push({ setV: values.setValue, cb });
  }
}

/**
 * Handling object tween.
 * @param {Object} e - targeted object.
 * @param {ps} ps - properties.
 */
function obj(e, ps, results) {
  for (const key in ps) {
    const props = { s: e[key], e: ps[key][0] };
    props.lerp = props.e - props.s;

    results.push({
      setV: (e, v) => (e[key] = v),
      cb: e => props.s + props.lerp * e
    });
  }
}

function props(e, o, ps) {
  const results = [];

  if (!o) dom(e, ps, results);
  else obj(e, ps, results);

  return results;
}

export default props;
