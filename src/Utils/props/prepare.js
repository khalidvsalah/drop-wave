import { query } from '../methods/query';
import { computed } from '../methods/coordinate';

// style
import opacity from './components/properties/opacity';
import transform from './components/properties/transform';
import clipPath from './components/properties/clipPath';
import filter from './components/properties/filter';

// svg
import draw from './components/svg/draw';
import points from './components/svg/points';
import path from './components/svg/path';

// attribute
import attribute from './components/properties/attribute';

/**
 * Get properties tween function
 * @param {HTMLElement} element - targeted element.
 * @param {object} ps - properties.
 * @returns {Array} - array of tweened function.
 */
function dom(element, ps) {
  const results = [];
  const info = {};

  info.element = element;
  info.parent = element.parentNode;
  info.computed = computed(element);

  for (const [regex, obj] of Object.entries(ps)) {
    const { setValue, callback } = match(regex);
    results.push({
      setValue: setValue(element),
      cb: callback(obj, info, regex),
    });
  }

  return results;
}

/**
 * Handling object tween like {x: 0}.
 * @param {HTMLElement} e - targeted element.
 * @param {object} ps - properties.
 * @returns {Array} - array of tweened function.
 */
function obj(element, ps) {
  const results = [];

  for (const key in ps) {
    const end = ps[key];
    if (typeof end === 'object') {
      obj(element[key], end).forEach((r) => results.push(r));
    } else {
      const start = element[key];
      const lerp = end - start;
      results.push({
        setValue: (value) => (element[key] = value),
        cb: (t) => start + lerp * t,
      });
    }
  }

  return results;
}

/**
 * @param {HTMLElement|string|obj} element
 * @returns {{obj:boolean, element:object}}
 */
function elementType(element) {
  if (element instanceof Node) return { isNode: true, element };
  if (typeof element === 'string') {
    return { isNode: true, element: query.el(element) };
  }
  return { isNode: false, element };
}

export const regexs = [
  [/^(transform|move)/, transform],
  [/^(opacity|alpha)/, opacity],
  [/^(clip|clipPath)/, clipPath],
  [/^(filter)/, filter],
  [/^(draw)/, draw],
  [/^(points)/, points],
  [/^(path)/, path],
];

/**
 * Return matched property
 * @param {string} name - regex.
 * @return {Function} - get properties function.
 */
export function match(name) {
  let found = false;
  for (const [regex, cb] of regexs) {
    if (name.match(regex)) {
      found = true;
      return cb;
    }
  }
  if (!found) return attribute;
}

/**
 * @param {HTMLElement} element - targeted element.
 */
export function prepare(target) {
  const targeted = elementType(target);

  /**
   * @param {object} ps - properties.
   * @returns {Array} array of tweened functions.
   */
  return (ps) => {
    if (targeted.isNode) return dom(targeted.element, ps);
    else return obj(targeted.element, ps);
  };
}
