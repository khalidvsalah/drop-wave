/**
 * @param {object} p - opacity.
 * @param {object} info - - {computed, element, parent}.
 * @return {Function}
 */
const opacity = (end, { computed }) => {
  const from = Array.isArray(end);
  const o = {
    start: from ? end[0] : +computed.opacity,
    end: from ? end[1] : end,
  };
  o.lerp = o.end - o.start;
  return (t) => `${o.start + o.lerp * t}`;
};

export default opacity;
