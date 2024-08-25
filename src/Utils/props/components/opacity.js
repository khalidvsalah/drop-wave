/**
 * @param {object} p - opacity.
 * @param {object} info - computed style.
 * @return {Function}
 */
const opacity = (end, { computed }) => {
  const ofrom = Array.isArray(end);
  const o = {
    start: ofrom ? end[0] : +computed.opacity,
    end: ofrom ? end[1] : end
  };
  o.lerp = o.end - o.start;
  return t => `${o.start + o.lerp * t}`;
};

const setValue = element => value => (element.style.opacity = value);
export default { callback: opacity, setValue };
