import ease from '../../Math/ease';
import { computed } from '../methods/coordinate';
import matches from './tools/matches';

/**
 * Get properties tween function
 * @param {HTMLElement} element - targeted element.
 * @param {object} ps - properties.
 * @param {object} results - array of tweens functions.
 * @param {Function} easing
 */
function dom(element, ps, results, easing) {
  const compute = computed(element);

  compute.el = element;
  compute.parent = element.parentNode;
  compute.easing = easing;

  for (const key of Object.entries(ps)) {
    const values = matches(key[0]);
    const cb = values.cb(key[1], compute);
    results.push({ setV: values.setValue, cb });
  }
}

/**
 * Handling object tween like {x: 0}.
 *
 * @param {HTMLElement} e - targeted element.
 * @param {object} ps - properties.
 * @param {object} results - array of tweens functions.
 * @param {Function} easing
 */
function obj(e, ps, results, easing) {
  for (const key in ps) {
    const oV = {
      s: e[key],
      e: ps[key][0],
      ease: ps[key][1] ? ease(ps[key][1]) : easing
    };

    oV.lerp = oV.e - oV.s;

    results.push({
      setV: (e, v) => (e[key] = v),
      cb: e => oV.s + oV.lerp * oV.ease(e)
    });
  }
}

/**
 * Entery Point
 *
 * @param {HTMLElement} e - targeted element.
 * @param {boolean} e - check if object.
 * @param {object} ps - properties.
 * @param {Function} easing
 * @returns {object} array of tweens functions.
 */
function props(e, o, ps, easing) {
  const results = [];

  if (!o) dom(e, ps, results, easing);
  else obj(e, ps, results, easing);

  return results;
}

export default props;
