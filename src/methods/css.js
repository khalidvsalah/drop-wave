import { computed } from '../methods/computed';

/**
 * @typedef {Object} css
 * @property {(element:NodeList|Node, key:string, value:string)=>void} set
 * @property {(element:NodeList|Node, key:string)=>string} get
 */
export const css = {
  set: (element, key, value) => {
    if (element.length) {
      element.forEach((el) => (el.style[key] = value));
    } else {
      element.style[key] = value;
    }
  },
  get: (element, key) => {
    return computed(element)[key];
  },
};
