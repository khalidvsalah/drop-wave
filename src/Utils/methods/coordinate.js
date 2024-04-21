const bounds = e => {
  let rect = e.getBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
    x: rect.x,
    y: rect.y,
    xE: rect.right,
    yE: rect.bottom
  };
};
const offset = element => {
  var width = element.offsetWidth,
    height = element.offsetHeight,
    left = element.offsetLeft,
    top = element.offsetTop;

  return {
    w: width,
    h: height,
    x: left,
    xE: left + width,
    y: top,
    yE: top + height
  };
};
const computed = c => window.getComputedStyle(c);

export { bounds, computed, offset };
