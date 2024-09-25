/**
 * @param {object} p - attribute.
 * @param {object} info - {computed, element, parent}.
 * @return {Function}
 */
const draw = (p, { element, computed }) => {
  const start = parseFloat(computed.strokeDashoffset);
  const length = element.getTotalLength();
  element.style.strokeDasharray = length;

  const ofrom = Array.isArray(p);
  const o = {
    start: ofrom ? (1 - p[0]) * length : start,
    end: (1 - (ofrom ? p[1] : p)) * length,
  };
  o.lerp = o.end - o.start;
  return (t) => `${o.start + o.lerp * t}`;
};

const setValue = (element) => (value) =>
  (element.style.strokeDashoffset = value);
export default { callback: draw, setValue };
