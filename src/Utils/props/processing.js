import { computed } from '../methods/coordinate';
import { findMatchingProperty } from './propertyMatchers';

/**
 * Get properties tween function
 * @param {HTMLElement} element - targeted element.
 * @param {object} ps - properties.
 * @returns {Array} - array of tweened function.
 */
export function processDOMElement(element, ps) {
  const results = [];
  const info = {};

  info.element = element;
  info.parent = element.parentNode;
  info.computed = computed(element);

  for (const [regex, obj] of Object.entries(ps)) {
    const { setValue, callback } = findMatchingProperty(regex);
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
export function processObjectProperties(element, ps) {
  const results = [];

  for (const key in ps) {
    const end = ps[key];
    if (typeof end === 'object') {
      processObjectProperties(element[key], end).forEach((r) =>
        results.push(r)
      );
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
