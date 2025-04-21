/**
 * Selector
 * @param {DOMSelector} elements target(s) or string selector
 * @returns {Element[]}
 */

export default function selector(elements) {
  if (typeof elements === 'string') {
    return document.querySelectorAll(elements);
  } else if (
    elements instanceof NodeList ||
    elements instanceof HTMLCollection
  ) {
    return elements;
  } else if (elements instanceof Array) {
    if (typeof elements[0] === 'number') {
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
  } else if (typeof elements === 'object' && elements !== null) {
    return [elements];
  }
}
