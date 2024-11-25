import matcher from '../processing/helpers/matcher';
import attributes from '../processing/property/attributes';
import cssProperties from '../processing/property/cssProperties';

class Register {
  /**
   * @param {string} name - property tweening name
   * @param {{CSSName:string, HTMLAttr:string, TweenFn:Function}}
   */
  push(name, { CSSName, HTMLAttr, TweenFn }) {
    if (this.check(name)) {
      throw new Error(name + ' is already registered');
    } else {
      const regex = new RegExp(`^(${name})`);
      if (CSSName) {
        cssProperties.push([regex, TweenFn, CSSName]);
      } else if (HTMLAttr) {
        attributes.push([regex, TweenFn, HTMLAttr]);
      }
    }
  }

  /**
   * @param {string} name - check if property exist
   */
  check(name) {
    return !!matcher(name);
  }
}

export const register = new Register();
