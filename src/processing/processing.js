import tweeningObj from './helpers/tweeningObj';

/**
 * Processing DOM Elements.
 *
 * @param {HTMLElement} element - targeted element.
 * @param {object} startProps - start properties.
 * @param {object} endProps - end properties.
 * @returns {Array} - array of pre-tweened functions.
 */
function processDOMElement(element, startProps, endProps) {
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
function processObjectProperties(element, startProps, endProps) {
  const results = [];

  for (const key in endProps) {
    const end = endProps[key];
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
 * Check if an object or DOMElement.
 *s
 * @param {HTMLElement} element - targeted element.
 * @param {object} startProps - start properties.
 * @param {object} endProps - end properties.
 * @returns {Array} - array of pre-tweened functions.
 */
export function processing(target, startProps, endProps) {
  if (target instanceof Node) {
    return processDOMElement(target, startProps, endProps);
  } else {
    return processObjectProperties(target, startProps, endProps);
  }
}
