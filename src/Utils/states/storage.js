export const storage = new Map();

/**
 * @param {object} key - targeted element
 * @param {*} value - targeted element
 * @returns {object} targeted element
 */

export function store(key, value) {
  const getValue = storage.get(key);
  if (!getValue) {
    storage.set(key, value);
    return value;
  } else return getValue;
}
