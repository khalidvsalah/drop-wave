/**
 * @param {object} p - attribute.
 * @param {object} info - {computed, element, parent}.
 * @return {Function}
 */
const draw = (p, { computed }) => {
  const length = parseFloat(computed.strokeDashoffset);
  const o = {
    start: length,
    end: (1 - p) * length,
  };
  o.lerp = o.end - o.start;
  return (t) => `${o.start + o.lerp * t}`;
};

const setValue = (element) => (value) =>
  (element.style.strokeDashoffset = value);
export default { callback: draw, setValue };
