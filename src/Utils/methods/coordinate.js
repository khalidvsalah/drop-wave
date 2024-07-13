/** @typedef {w: Number, h: Number, x: Number, y: Number, xE: Number, yE: Number} Coordinates*/

/**
 * getBoundingClientRect.
 *
 * @param {HTMLElement} element
 * @returns {Coordinates}
 */
const bounds = element => {
  let rect = element.getBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
    x: rect.x,
    y: rect.y,
    xE: rect.right,
    yE: rect.bottom
  };
};

/**
 *  Element offsets
 *
 * @param {HTMLElement} element
 * @returns {Coordinates}
 */
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

/**
 *  getComputedStyle
 *
 * @param {HTMLElement} element
 */
const computed = element => window.getComputedStyle(element);
export { bounds, computed, offset };
