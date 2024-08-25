import { regexs, match } from '../Utils/props/prepare';

/** * @typedef {{element:HTMLElement, computed:object, parent:HTMLTimeElement}} INFO */
/** * @typedef {(p:object, info:INFO)=> Function} CALLBACK */

/**
 * @param {string} shortName - property name
 * @param {{name:string, callback:CALLBACK}} options
 */
export const register = (shortName, options) => {
  if (match(shortName)) {
    throw new Error(`${shortName} is already registered`);
  } else {
    const regex = new RegExp(`^(${shortName})`);
    const component = {
      callback: options.callback,
      setValue: element => value => (element.style[options.name] = value)
    };
    regexs.push([regex, component]);
  }
};
