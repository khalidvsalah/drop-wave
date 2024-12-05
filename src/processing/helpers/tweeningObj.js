import matcher from './matcher';

/**
 * Return tweened object
 * 
 * @param {HTMLElement} element
 * @param {string} name - regex.
 * @return {object}
 */
export default function tweeningObj(element, name) {
  try {
    const { type, property } = matcher(name);
    return {
      setValue:
        type === 'CSS'
          ? (value) => (element.style[property.name] = value)
          : (value) => element.setAttribute(property.name, value),
      callback: property.callback,
    };
  } catch (e) {
    throw new ReferenceError(`The Provided CSS Property not defined (${name})`);
  }
}
