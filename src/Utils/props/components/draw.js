const draw = (p, { element }) => {
  const length = element.getTotalLength();
  element.style.strokeDasharray = length;
  const lerp = (p[1] - p[0]) / 100;
  return t => `${(p[0] + lerp * t) * length}`;
};

const setValue = (element, value) => (element.style.strokeDashoffset = value);
export default { property: draw, setValue };
