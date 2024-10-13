import { cssProperties } from '../processing/propertyMatchers';

/** * @typedef {{element:HTMLElement, computed:object, parent:HTMLTimeElement}} INFO */
/** * @typedef {(obj:object, info:INFO, name:string)=> Function} CALLBACK */

/**
 * @param {string} name - property tweening name
 * @param {string} cssName - the css name
 * @param {CALLBACK} callback
 */
export const register = (name, cssName, callback) => {
  if (cssProperties.some(([regex]) => name.match(regex))) {
    throw new Error(name + ' is already registered');
  } else {
    const regex = new RegExp(`^(${name})`);
    const component = {
      callback,
      setValue: (element) => (value) => (element.style[cssName] = value),
    };
    cssProperties.push([regex, component]);
  }
};
