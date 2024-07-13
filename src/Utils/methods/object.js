/**
 * @param {object} obj
 * @param {string} prop
 * @returns {boolean}
 */
const has = (obj, prop) => window.hasOwnProperty.call(obj, prop);
const toString = obj => JSON.stringify(obj);
export { has, toString };
