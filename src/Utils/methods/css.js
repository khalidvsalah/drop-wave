/** @typedef {(element:HTMLElement, value:string)=> string} */
/**
 * @typedef {Object} CSS
 * @property {CSSProp} alpha
 * @property {CSSProp} display
 * @property {CSSProp} pointer
 * @property {CSSProp} position
 * @property {CSSProp} visible
 */

/** @type {CSS} */
const css = {
  alpha: (element, value) => (element.style.opacity = value),
  display: (element, value) => (element.style.display = value),
  pointer: (element, value) => (element.style.pointerEvents = value),
  position: (element, value) => (element.style.position = value),
  visible: (element, value) => (element.style.visibility = value)
};

export default css;
