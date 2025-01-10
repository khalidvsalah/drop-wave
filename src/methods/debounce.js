/**
 * @param {number} time
 * @param {Function} cb
 * @returns {Function}
 */
export function debounce({ time = 0, cb }) {
  time *= 1000;
  let timer = 0;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(cb, time);
  };
}
