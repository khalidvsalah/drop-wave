/**
 * @typedef {Object} TWEEN_OPTIONS
 * @property {number} [duration]
 * @property {number} [delay]
 * @property {number} [space]
 * @property {string} [ease]
 * @property {object} [props]
 * @property {Function} [onStart]
 * @property {Function} [onUpdate]
 * @property {Function} [onComplete]
 */

/**
 * @typedef {Object} TWEEN_CONTROLLERS
 * @property {Function} reverse
 * @property {Function} play
 * @property {Function} pause
 * @property {Function} kill
 */

/**
 * @typedef {Object} SCROLL_OPTIONS
 * @property {string} [name]
 * @property {Window|HTMLElement} [container]
 * @property {'x'|'y'} [dir]
 * @property {boolean} [drag]
 * @property {boolean} [wheel]
 * @property {boolean} [key]
 * @property {number} [speed]
 * @property {Function} [onUpdate]
 * @property {boolean} [infinite]
 */

/**
 * Trigger options
 * @typedef {Object} TRIGGER_OPTIONS
 * @property {object} animate
 * @property {object} tween
 * @property {boolean} scroll
 * @property {string|number} start
 * @property {string|number} end
 * @property {{start:string|number, end:start|number}} pin
 * @property {Function} onUpdate
 */
