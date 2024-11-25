import { computed } from '../helpers/computed';

/**
 * @typedef {Object} css
 * @property {(element:NodeList|Node, key:string, value:string)=>void} set
 * @property {(element:NodeList|Node, key:string)=>string} get
 */
export const css = {
  set: (element, key, value) => {
    element.style[key] = value;
  },
  get: (element, key) => {
    return computed(element)[key];
  },
};
