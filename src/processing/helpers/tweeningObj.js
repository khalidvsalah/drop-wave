import matcher from './matcher';

/**
 * Return tweened object
 * @param {HTMLElement} element
 * @param {string} name - regex.
 * @return {object}
 */
export default function tweeningObj(element, name) {
  try {
    const { type, callback, property } = matcher(name);
    return {
      setValue: (value) =>
        type === 'CSS'
          ? (element.style[property] = value)
          : element.setAttribute(property, value),
      callback,
    };
  } catch (e) {
    throw new ReferenceError(`The Provided CSS Property not defined (${name})`);
  }
}
