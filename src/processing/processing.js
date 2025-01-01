import tweeningObj from './helpers/tweeningObj';

/**
 * Processing DOM Elements.
 *
 * @param {HTMLElement} element - targeted element.
 * @param {object} startProps - start properties.
 * @param {object} endProps - end properties.
 * @returns {Array} - array of pre-tweened functions.
 */
export function processDOMElement(element, startProps, endProps) {
  const results = [];
  const info = {
    element,
    parent: element.parentElement,
    computed: startProps,
  };

  for (const [regex, obj] of Object.entries(endProps)) {
    let { setValue, callback } = tweeningObj(element, regex);
    callback = callback(obj, info, regex);
    results.push({ tween: (t) => setValue(callback(t)) });
  }

  return results;
}

/**
 * Processing object.
 *
 * @param {HTMLElement} element - targeted element.
 * @param {object} startProps - start properties.
 * @param {object} endProps - end properties.
 * @returns {Array} - array of pre-tweened functions.
 */
export function processObjectProperties(element, startProps, endProps) {
  const results = [];

  for (const key in endProps) {
    const end = endProps[key];

    if (typeof end === 'object') {
      const depth = processObjectProperties(element[key], startProps[key], end);
      depth.forEach((property) => results.push(property));
    } else {
      const start = startProps[key];
      const lerp = end - start;
      const callback = (t) => start + lerp * t;
      results.push({ tween: (t) => (element[key] = callback(t)) });
    }
  }

  return results;
}
