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
import attribute from './components/properties/attribute';

export const propertyMatchers = [
  [/^(transform|move)/, transform],
  [/^(opacity|alpha)/, opacity],
  [/^(clip|clipPath)/, clipPath],
  [/^(filter)/, filter],
  [/^(draw)/, draw],
  [/^(points)/, points],
  [/^(path)/, path],
];

/**
 * Return matched property
 * @param {string} name - regex.
 * @return {Function} - get properties function.
 */
export function findMatchingProperty(name) {
  let found = false;
  for (const [regex, cb] of propertyMatchers) {
    if (name.match(regex)) {
      found = true;
      return cb;
    }
  }
  if (!found) return attribute;
}
