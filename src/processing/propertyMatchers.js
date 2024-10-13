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
export function propertyMatchers(element, name) {
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
