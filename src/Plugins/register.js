import matcher from '../processing/helpers/matcher';
import attributes from '../processing/property/attributes';
import cssProperties from '../processing/property/cssProperties';

/**
 * registerType
 * @typedef {object} registerType
 * @property {string} [tweeningName] - short name of the property.
 * @property {string} [CSSName] - the property actual css name.
 * @property {string} [HTMLAttr] - the attribute actual css name.
 * @property {(target:Node, info:elementContextType)=> Function} TweeningFn - the tweeing function.
 */

class Register {
  /**
   * @param {registerType}
   */
  push({ tweeningName, CSSName, HTMLAttr, TweeningFn }) {
    if (this.check(tweeningName)) {
      throw new Error(tweeningName + ' is already registered');
    } else {
      const regex = new RegExp(`^(${tweeningName})`);
      if (CSSName) {
        cssProperties.push([regex, TweeningFn, CSSName]);
      } else if (HTMLAttr) {
        attributes.push([regex, TweeningFn, HTMLAttr]);
      }
    }
  }

  /**
   * @param {string} tweeningName - check if property exist
   */
  check(tweeningName) {
    return !!matcher(tweeningName);
  }
}

export const register = new Register();
