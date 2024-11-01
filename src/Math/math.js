/**
 * @param {number}  min - min value
 * @param {number}  max - max value
 * @param {number}  a - alpha value
 * @return {number} clamped value
 */
const clamp = (min, max, a) => Math.min(Math.max(min, a), max);

/**
 * @param {number}  x - start value
 * @param {number}  y - end value
 * @param {number}  a - ease value
 * @return {number} lerp value
 */
const lerp = (x, y, a) => (1 - a) * x + a * y;

/**
 * @param {number}  x - start value
 * @param {number}  y - end value
 * @param {number}  a - alpha value
 * @return {number} mapped value
 */
const normalize = (a, b, x) => (x - a) / (b - a);

/**
 * map: transform or reassign values from one range or domain to another range
 * @param {number}  x - start value of range1
 * @param {number}  y - end value of range1
 * @param {number}  c - start value of range2
 * @param {number}  d - end value of range2
 * @param {number}  a - alpha value
 * @return {number} map value
 */
const map = (a, b, c, d, x) => normalize(a, b, x) * (d - c) + c;

/**
 * Round number to the specified precision.
 * @param {number}  num - floating number
 * @param {number}  pow - The number of digits to appear after the decimal point
 * @return {number} - rounded value
 */
const round = (num, pow) => {
  const d = pow ? Math.pow(10, pow) : 100;
  return Math.round(num * d) / d;
};

/**
 * Get Radius
 * @param {number}  x - X
 * @param {number}  y - Y
 * @return {number} Radius Value
 */
const dist = (x, y) => Math.sqrt(x ** 2 + y ** 2);

/**
 * @param {number}  t - start value
 * @param {number}  s - end value
 * @param {number}  i - ease value
 * @param {number}  n - exp
 * @return {number} damp Value
 */
const damp = (t, s, i, n = 0.50399) => lerp(t, s, 1 - Math.exp(-i * n));

/**
 * @param {number}  a - start
 * @param {number}  b - end
 * @param {number}  x
 * @return {boolean} inRange
 */
const inRange = (a, b, x) => x >= a && b >= x;

export { clamp, lerp, normalize, map, round, dist, damp, inRange };
