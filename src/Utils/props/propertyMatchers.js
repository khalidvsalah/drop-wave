// css properties
import opacity from './components/properties/opacity';
import transform from './components/properties/transform';
import clipPath from './components/properties/clipPath';
import filter from './components/properties/filter';

// svg
import draw from './components/svg/draw';
import points from './components/svg/points';
import path from './components/svg/path';

// attribute
// import attribute from './components/properties/attribute';

export const cssProperties = [
  [/^(transform|move)/, transform, 'transform'],
  [/^(opacity|alpha)/, opacity, 'opacity'],
  [/^(clip|clipPath)/, clipPath, 'clip-path'],
  [/^(filter)/, filter, 'filter'],
  [/^(draw)/, draw, 'draw'],
];

const attributes = [
  [/^(points)/, points, 'points'],
  [/^(path)/, path, 'path'],
];

/**
 * Return matched property
 * @param {string} name - regex.
 * @return {Function} - get properties function.
 */
export function findMatchingProperty(element, name) {
  for (const [regex, callback, propertyName] of cssProperties) {
    if (name.match(regex)) {
      return {
        setValue: (value) => (element.style[propertyName] = value),
        callback,
      };
    }
  }
  for (const [regex, callback, attr] of attributes) {
    if (name.match(regex)) {
      return {
        setValue: (value) => element.setAttribute(attr, value),
        callback,
      };
    }
  }
}
