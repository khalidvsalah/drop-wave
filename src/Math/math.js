/**
 * Clamp value
 *
 * @param {number}  min - start value
 * @param {number}  max - end value
 * @param {number}  a - alpha value
 * @return {number} clamped value
 */
const zero = (min, a) => Math.max(min, a);

/**
 * Clamp value
 *
 * @param {number}  min - start value
 * @param {number}  max - end value
 * @param {number}  a - alpha value
 * @return {number} clamped value
 */
const clamp = (min, max, a) => Math.min(Math.max(min, a), max);

/**
 * Calculate lerp
 
 * @param {number}  x - start value
 * @param {number}  y - end value
 * @param {number}  a - alpha value
 * @return {number} lerp value
 */
const lerp = (x, y, a) => (1 - a) * x + a * y;

/**
 * Map
 
 * @param {number}  x - start value
 * @param {number}  y - end value
 * @param {number}  a - alpha value
 * @return {number} mapped value
 */
const map = (a, b, x) => clamp(0, 1, (x - a) / (b - a));

/**
 * Remap: transform or reassign values from one range or domain to another range
 
 * @param {number}  x - start value of range1
 * @param {number}  y - end value of range1
 * @param {number}  c - start value of range2
 * @param {number}  d - end value of range2
 * @param {number}  a - alpha value
 * @return {number} remapped value
 */
const remap = (x, y, c, d, a) => map(x, y, a) * (d - c) + c;

/**
 * Round number to the specified precision.
 
 * @param {number}  num - floating number
 * @param {number}  pow - The number of digits to appear after the decimal point
 * @return {number} remapped value
 */
const round = (num, pow) => {
  const d = pow ? Math.pow(10, pow) : 100;
  return Math.round(num * d) / d;
};

export { clamp, lerp, map, remap, round, zero };
