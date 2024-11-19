/**
 * selector
 *
 * @param {any} elements target(s) or string selector
 * @param {Blob} obj select object also
 * @returns {Element | Element[] | null}
 */

export default function selector(elements, obj) {
  if (typeof elements === 'string') {
    return document.querySelectorAll(elements);
  } else if (
    elements instanceof NodeList ||
    elements instanceof HTMLCollection
  ) {
    return elements;
  } else if (elements instanceof Array) {
    if (obj && elements.every((element) => typeof element === 'number')) {
      return elements;
    } else {
      return elements;
    }
  } else if (elements instanceof Node) {
    return [elements];
  } else if (obj && typeof elements === 'object' && elements !== null) {
    return [elements];
  }

  console.warn(`Drop-Wave target element ${elements} not found.`);
}
