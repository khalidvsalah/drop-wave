import cssProperties from '../property/cssProperties';
import attributes from '../property/attributes';

/**
 * Return matched property object
 * @param {string} name - regex.
 * @return {object} - get properties function.
 */
export default function matcher(name) {
  for (const [regex, callback, propertyName] of cssProperties) {
    if (name.match(regex)) {
      return {
        type: 'CSS',
        callback,
        property: propertyName,
      };
    }
  }
  for (const [regex, callback, attr] of attributes) {
    if (name.match(regex)) {
      return {
        type: 'ATTR',
        callback,
        property: attr,
      };
    }
  }
}
