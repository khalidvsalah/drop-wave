// css properties
import opacity from '../components/opacity';
import transform from '../components/transform';
import clipPath from '../components/clipPath';
import filter from '../components/filter';

// svg
import draw from '../components/draw';
import points from '../components/points';
import path from '../components/path';

// attribute
// import attribute from './components/properties/attribute';

export const cssProperties = [
  [/^(transform|move)/, transform, 'transform'],
  [/^(opacity|alpha)/, opacity, 'opacity'],
  [/^(clip|clipPath)/, clipPath, 'clip-path'],
  [/^(filter)/, filter, 'filter'],
  [/^(draw)/, draw, 'strokeDashoffset'],
];

export const attributes = [
  [/^(points)/, points, 'points'],
  [/^(path)/, path, 'path'],
];

/**
 * Return matched property object
 * @param {string} name - regex.
 * @return {object} - get properties function.
 */
export function propertyMatchers(name) {
  for (const [regex, callback, propertyName] of cssProperties) {
    if (name.match(regex)) {
      return {
        type: 'css',
        callback,
        property: propertyName,
      };
    }
  }
  for (const [regex, callback, attr] of attributes) {
    if (name.match(regex)) {
      return {
        type: 'attr',
        callback,
        property: attr,
      };
    }
  }
}

/**
 * Return tweened object
 * @param {HTMLElement} element
 * @param {string} name - regex.
 * @return {object}
 */
export function propertyTweener(element, name) {
  try {
    const { type, callback, property } = propertyMatchers(name);
    return {
      setValue: (value) =>
        type === 'css'
          ? (element.style[property] = value)
          : element.setAttribute(property, value),
      callback,
    };
  } catch (e) {
    throw new ReferenceError(`The Provided CSS Property not defined (${name})`);
  }
}
