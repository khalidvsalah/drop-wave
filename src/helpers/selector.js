/**
 * Selector
 * @param {DOMSelector} elements target(s) or string selector
 * @param {boolean} obj select object also
 * @returns {Element[]}
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
      const eles = [];
      for (let i = 0; i < elements.length; i++) {
        const el = selector(elements[i]);
        if (el) eles.push(...el);
      }
      return eles;
    }
  } else if (elements instanceof Node) {
    return [elements];
  } else if (obj && typeof elements === 'object' && elements !== null) {
    return [elements];
  }
}
