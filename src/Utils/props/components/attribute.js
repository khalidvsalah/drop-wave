let attr;
const unit = attr => {
  const [, number, unit] = /(\d+)(%|px)?/.exec(attr);
  return [+number, unit];
};

/**
 * @param {object} p - attribute.
 * @param {object} info - {computed, element, parent} .
 * @param {string} attr - attribute style.
 * @return {Function}
 */
const setAttribute = (end, { element }, attribute) => {
  attr = attribute;
  const start = unit(element.getAttribute(attr));
  const ofrom = Array.isArray(end);
  const o = {
    start: ofrom ? +end[0] : start[0],
    end: ofrom ? +end[1] : +end,
    unit: start[1] || ''
  };

  o.lerp = o.end - o.start;
  return t => `${o.start + o.lerp * t + o.unit}`;
};

const setValue = element => value => element.setAttribute(attr, value);
export default { callback: setAttribute, setValue };
