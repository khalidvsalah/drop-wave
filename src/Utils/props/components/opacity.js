/**
 * @param {object} p - opacity.
 * @param {object} info - computed style.
 * @return {Function}
 */
const opacity = (end, { computed }) => {
  const o = { start: +computed.opacity, end };
  o.lerp = o.end - o.start;
  return t => `${o.start + o.lerp * t}`;
};

const setValue = element => value => (element.style.opacity = value);
export default { callback: opacity, setValue };
