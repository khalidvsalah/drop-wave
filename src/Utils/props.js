import { computed, ease } from '../index';

import alpha from './properties/alpha';
import d from './properties/d';
import dash from './properties/dash';
import points from './properties/points';
import top from './properties/top';
import transform from './properties/transform';
import blur from './properties/blur';
import width from './properties/width';
import height from './properties/height';

/**
 * Get CSS property
 * @param {string} name - property short name.
 * @return {Function} - get properties function.
 */
function match(name) {
  if (name.match(/^(form)$/)) return transform;
  else if (name.match(/^(a)$/)) return alpha;
  else if (name.match(/^(dash)$/)) return dash;
  else if (name.match(/^(points)$/)) return points;
  else if (name.match(/^(d)$/)) return d;
  else if (name.match(/^(t)$/)) return top;
  else if (name.match(/^(blur)$/)) return blur;
  else if (name.match(/^(width)$/)) return width;
  else if (name.match(/^(height)$/)) return height;
}

/**
 * Get Array of properties function
 * @param {HTMLElement} e - targeted element.
 * @param {Object} ps - properties need to be modified.
 * @return {Array}
 */
function dom(e, ps) {
  const results = [];
  const c = computed(e);

  const dir = ps.dir == -1 ? true : false;
  const easef = ease[ps.ease || 'l'];

  c.el = e;
  c.pa = e.parentNode;

  for (const key of Object.entries(ps)) {
    if (key[0] == 'dir') continue;
    if (key[0] == 'ease') continue;

    const values = match(key[0]);
    const cb = values.cb(key[1], c);

    let easing = key[1][key[1].length - 1];
    if (easing == undefined) easing = ease[key[1].ease];
    else easing = ease[easing.ease];

    easing = easing || easef;

    results.push({
      setV: values.setValue,
      cb: (e) => cb(easing(dir ? 1 - e : e))
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
      cb: (e) => pV.s + pV.lerp * e
    });
  }

  return results;
}

function props(e, o, ps) {
  if (!o) return dom(e, ps);
  else return obj(e, ps);
}

export default props;
