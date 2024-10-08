import { lerp } from '../../../../index';

const commandLengths = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0,
};

// Regular expressions for parsing
const commandPattern = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
const numberPattern = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

/**
 * Parses a string of path values into an array of numbers.
 * @param {string} args - The string containing path values.
 * @returns {number[]} - An array of parsed numbers.
 */
function parseValues(args) {
  const matches = args.match(numberPattern);
  return matches ? matches.map(Number) : [];
}

/**
 * Parses an SVG path data string into an array of commands and their parameters.
 * @param {string} path - The SVG path data string.
 * @returns {Array} - An array of commands with their parameters.
 */
function parsePathData(path) {
  const parsedData = [];

  path.replace(commandPattern, (match, command, args) => {
    let type = command.toLowerCase();
    const parameters = parseValues(args);

    // Special handling for 'M' command with more than 2 parameters
    if (type === 'm' && parameters.length > 2) {
      parsedData.push([command].concat(parameters.splice(0, 2)));
      type = 'l'; // change to 'l' for line command
      command = command === 'm' ? 'l' : 'L';
    }

    // Process remaining parameters based on command type
    while (parameters.length) {
      if (parameters.length === commandLengths[type]) {
        parsedData.push([command].concat(parameters));
        break;
      }
      if (parameters.length < commandLengths[type]) {
        throw new Error('Malformed path data');
      }
      parsedData.push(
        [command].concat(parameters.splice(0, commandLengths[type]))
      );
    }
  });

  return parsedData;
}

/**
 * Normalizes the lengths of two path command arrays by interpolating extra commands.
 * @param {Array} startCommands - The starting path data as an array of commands.
 * @param {Array} endCommands - The ending path data as an array of commands.
 * @returns {Object} - An object with normalized start and end command arrays.
 */
function normalizePathLengths(startCommands, endCommands) {
  const totalLength = Math.max(startCommands.length, endCommands.length);
  const normalizedStart = [];
  const normalizedEnd = [];

  for (let i = 0; i < totalLength; i++) {
    const startCommand = startCommands[i] || ['Z'];
    const endCommand = endCommands[i] || ['Z'];

    normalizedStart.push(startCommand);
    normalizedEnd.push(endCommand);
  }

  return { normalizedStart, normalizedEnd };
}

/**
 * Creates an interpolated SVG path string generator between two path data strings.
 * @param {Array} startPath - The starting path data as an array of commands.
 * @param {Object} endPathElement - The end path element containing its 'd' attribute.
 * @returns {Function} - A function that returns the interpolated path string based on parameter t (0 to 1).
 */
const path = (p, { element }) => {
  const start = parsePathData(p);
  const end = parsePathData(element.getAttribute('d'));

  const { normalizedStart, normalizedEnd } = normalizePathLengths(start, end);

  return (t) => {
    let interpolatedPath = '';

    for (let i = 0; i < normalizedStart.length; i++) {
      const startCommand = normalizedStart[i];
      const endCommand = normalizedEnd[i];

      const interpolatedCommand = startCommand.map((value, index) => {
        return isNaN(value) ? value : lerp(value, endCommand[index], t);
      });

      interpolatedPath += interpolatedCommand.join(' ') + ' ';
    }

    return interpolatedPath.trim();
  };
};

export default path;
