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
  return {
    y: element.offsetTop,
    yE: element.offsetTop + element.offsetHeight,
    x: element.offsetLeft,
    xE: element.offsetLeft + element.offsetWidth
  };
};
const computed = c => window.getComputedStyle(c);

export { bounds, computed, offset };
