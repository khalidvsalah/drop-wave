import { lerp } from '../math/math';

/**
 * @param {string} pointString
 * @returns {(number|string)[]} - An array of numbers and strings parsed from the input string.
 */
const parsePoints = (pointString) => {
  const result = [];
  const pointPairs = pointString.split(' ');

  for (const pair of pointPairs) {
    const coordinates = pair.split(',');
    for (const coord of coordinates) {
      result.push(isNaN(coord) ? coord : +coord);
    }
  }

  return result;
};

/**
 * Creates an interpolating function between two sets of point coordinates.
 * @param {string} p
 * @param {object} info
 * @returns {Function}
 */
const points = (p, { element }) => {
  const startPoints = parsePoints(element.getAttribute('points'));
  const endPoints = parsePoints(p);

  return (t) => {
    return startPoints
      .map((point, i) => lerp(point, endPoints[i], t))
      .join(' ');
  };
};

export default points;
