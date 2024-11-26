let attr;
const unit = (attr) => {
  const [, number, unit] = /((\d+(\.\d+)?))(%|px)?/.exec(attr);
  return [+number, unit];
};

/**
 * @param {object} target - attribute.
 * @param {object} info - {computed, element, parent}.
 * @param {string} attribute - attribute style.
 * @return {Function}
 */
const setAttribute = (target, { element }, attribute) => {
  attr = attribute;
  const start = unit(element.getAttribute(attr));
  const ofrom = Array.isArray(target);
  const o = {
    start: ofrom ? +target[0] : start[0],
    end: ofrom ? +target[1] : +target,
    unit: start[1] || '',
  };

  o.lerp = o.end - o.start;
  return (t) => `${o.start + o.lerp * t + o.unit}`;
};

const setValue = (element) => (value) => element.setAttribute(attr, value);
export default { callback: setAttribute, setValue };
