import cssProperties from '../property/cssProperties';
import attributes from '../property/attributes';

/**
 * Return matched property object
 * @param {string} name - regex.
 * @return {object} - get properties function.
 */
export default function matcher(name) {
  for (const [regex, property] of cssProperties) {
    if (name.match(regex)) {
      return {
        type: 'CSS',
        property,
      };
    }
  }
  for (const [regex, property] of attributes) {
    if (name.match(regex)) {
      return {
        type: 'ATTR',
        property,
      };
    }
  }
}
