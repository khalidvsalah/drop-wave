/**
 * coordinatesType
 * @typedef {object} coordinatesType
 * @property {number} w
 * @property {number} h
 * @property {number} x
 * @property {number} y
 * @property {number} xE
 * @property {number} yE
 */

/**
 * @param {HTMLElement} element
 * @returns {coordinatesType}
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
 * @returns {coordinatesType}
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

export { bounds, offset };
