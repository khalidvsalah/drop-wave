// style
import opacity from './components/opacity';
import transform from './components/transform';
import clipPath from './components/clipPath';

// svg
import draw from './components/draw';
// import d from './components/d';

const regexs = [
  [/^(transform)/, transform],
  [/^(opacity|alpha)/, opacity],
  [/^(clip|clipPath)/, clipPath],
  [/^(draw)/, draw]
  // [/^(dash)$/, dash],
  // [/^(points)$/, points],
  // [/^(d)$/, d],
];

/**
 * @param {string} propertyName - property name
 * @param {{property:Function, setValue:Function}} obj
 */
export const addProperty = (propertyName, obj) => {
  if (match(propertyName)) {
    throw new Error(`${propertyName} is already registered`);
  } else {
    const regex = new RegExp('^(' + propertyName + ')');
    regexs.push([regex, obj]);
  }
};

/**
 * Return matched property
 * @param {string} name - regex.
 * @return {Function} - get properties function.
 */
function match(name) {
  for (const [regex, cb] of regexs) {
    if (name.match(regex)) return cb;
  }
}

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

  for (const [regex, obj] of Object.entries(ps)) {
    const { setValue, property } = match(regex);
    results.push({ setValue, cb: property(obj, info) });
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
  if (element instanceof Node) return { obj: false, element };
  else if (typeof element === 'string')
    return { obj: false, element: query.el(element) };

  return { obj: true, element };
}

/**
 * @param {HTMLElement} e - targeted element.
 * @param {object} ps - properties.
 * @param {Function} easing
 * @returns {Array} array of tweens functions.
 */
export function props(element, ps) {
  if (elementType(element).obj) return obj(element, ps);
  else return dom(element, ps);
}
