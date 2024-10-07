import { computed } from './coordinate';

/**
 * @typedef {Object} CSS
 * @property {(element:NodeList|Node, key:string, value:string)=>void} set
 * @property {(element:NodeList|Node, key:string)=>string} get
 */
export const CSS = {
  set: (element, key, value) => {
    element.style[key] = value;
  },
  get: (element, key) => {
    return computed(element)[key];
  },
};
