/**
 * @typedef {{w:number, h:number, x:number, y:number, xE:number, yE:number}} Coordinates
 * */

/**
 * @param {HTMLElement} element
 * @returns {Coordinates}
 */
const bounds = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
    x: rect.x,
    y: rect.y,
    xE: rect.right,
    yE: rect.bottom,
  };
};

/**
 * @param {HTMLElement} element
 * @returns {Coordinates}
 */
const offset = (element) => {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const left = element.offsetLeft;
  const top = element.offsetTop;

  return {
    w: width,
    h: height,
    x: left,
    xE: left + width,
    y: top,
    yE: top + height,
  };
};

/**
 * @param {HTMLElement} element
 */
const computed = (element) => window.getComputedStyle(element);
export { bounds, computed, offset };
