import { query } from '../methods/query';
import { computed } from '../methods/coordinate';

// style
import opacity from './components/opacity';
import transform from './components/transform';
import clipPath from './components/clipPath';
import filter from './components/filter';

// svg
import draw from './components/draw';

// attribute
import attribute from './components/attribute';

/**
 * Get properties tween function
 * @param {HTMLElement} element - targeted element.
 * @param {object} ps - properties.
 * @param {object} results - array of tweens functions.
 * @param {Function} easing
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
      cb: callback(obj, info, regex)
    });
  }

  return results;
}

/**
 * Handling object tween like {x: 0}.
 *
 * @param {HTMLElement} e - targeted element.
 * @param {object} ps - properties.
 * @param {object} results - array of tweens functions.
 * @param {Function} easing
 */
function obj(element, ps) {
  const results = [];

  for (const key in ps) {
    const [start, end] = ps[key];
    const lerp = end - start;
    results.push({
      setValue: value => (element[key] = value),
      cb: t => start + lerp * t
    });
  }

  return results;
}

/**
 * @param {HTMLElement|string|obj} element
 * @returns {{obj:boolean, element:object}}
 */
function elementType(element) {
  if (element instanceof Node) {
    return { obj: false, element };
  }

  if (typeof element === 'string') {
    return { obj: false, element: query.el(element) };
  }
  return { obj: true, element };
}

export const regexs = [
  [/^(transform|move)/, transform],
  [/^(opacity|alpha)/, opacity],
  [/^(clip|clipPath)/, clipPath],
  [/^(draw)/, draw],
  [/^(filter)/, filter]
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

export class Prepare {
  /**
   * @param {HTMLElement} element - targeted element.
   */
  constructor(element) {
    this.obj = elementType(element);
    this.target = this.obj.element;
  }

  /**
   * @param {object} ps - properties.
   * @returns {Array} array of tweens functions.
   */
  init(ps) {
    if (this.obj.obj) {
      return obj(this.obj.element, ps);
    }
    return dom(this.obj.element, ps);
  }
}
