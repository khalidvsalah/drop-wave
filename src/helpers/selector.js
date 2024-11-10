export default function selector(elements) {
  const nodes = [];

  try {
    if (typeof elements === 'string') {
      nodes.push(...document.querySelectorAll(elements));
      if (nodes.length === 0) throw new Error();
    } else if (elements instanceof NodeList) {
      nodes.push(...elements);
    } else if (Array.isArray(elements)) {
      if (typeof elements[0] === 'number') nodes.push(elements);
      else nodes.push(...elements);
    } else nodes.push(elements);

    return nodes;
  } catch (e) {
    throw TypeError('Element(s) not found: ' + elements);
  }
}
