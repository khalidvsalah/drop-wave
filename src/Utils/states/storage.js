export const storage = new Map();

/**
 * @param {object} key
 * @param {*} value
 * @returns {object} - stored value
 */

export function store(key, value) {
  const getValue = storage.get(key);
  if (!getValue) {
    storage.set(key, value);
    return value;
  }
  return getValue;
}
