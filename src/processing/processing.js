import { computed } from '../methods/coordinate';
import tweeningObj from './helpers/tweeningObj';

/**
 * Get properties tween function
 * @param {HTMLElement} element - targeted element.
 * @param {object} ps - properties.
 * @returns {Array} - array of tweened function.
 */
function processDOMElement(element, ps) {
  const results = [];
  const info = {};

  info.element = element;
  info.parent = element.parentNode;
  info.computed = computed(element);

  for (const [regex, obj] of Object.entries(ps)) {
    const { setValue, callback } = tweeningObj(element, regex);
    results.push({
      setValue,
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
function processObjectProperties(element, ps) {
  const results = [];

  for (const key in ps) {
    const end = ps[key];
    const isArray = Array.isArray(end);

    if (typeof end === 'object' && !isArray) {
      processObjectProperties(element[key], end).forEach((property) => {
        results.push(property);
      });
    } else {
      const start = isArray ? end[0] : element[key];
      const lerp = (isArray ? end[1] : end) - start;

      results.push({
        setValue: (value) => (element[key] = value),
        cb: (t) => start + lerp * t,
      });
    }
  }

  return results;
}

/**
 * @param {HTMLElement} element - targeted element.
 * @param {object} props - properties.
 */
export function processing(target, props) {
  if (target instanceof Node) return processDOMElement(target, props);
  else return processObjectProperties(target, props);
}
