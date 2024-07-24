/**
 * @param {object} p - opacity.
 * @return {Function}
 */
const opacity = p => {
  const lerp = p[1] - p[0];
  return t => `${p[0] + lerp * t}`;
};

const setValue = (element, value) => (element.style.opacity = value);
export default { property: opacity, setValue };
