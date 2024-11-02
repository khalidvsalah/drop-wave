/** * @typedef {NodeList|Node|HTMLElement|Array} NODE */
/** * @typedef {string|Array<string>} STRING_ARR */
/** * @typedef {string|Array<number>} NUMBER_ARR */

/* Start Properties */
/** * @typedef {{x:STRING_ARR, y:STRING_ARR, scale:NUMBER_ARR, scaleX:NUMBER_ARR, scaleY:NUMBER_ARR}} TRANSFORM */
/** * @typedef {{circle:FROM_TO, polygon:FROM_TO}} CLIP_PATH */
/* End Properties */

/**
 * @typedef {Object} PROPERTIES
 * @property {number} [opacity]
 * @property {number} [alpha]
 * @property {TRANSFORM} [transform]
 * @property {TRANSFORM} [move]
 * @property {CLIP_PATH} [clip]
 * @property {CLIP_PATH} [clipPath]
 * @property {{gray:FROM_TO, blur:FROM_TO, contrast:FROM_TO}} [filter]
 * @property {NUMBER_ARR} [draw]
 */

/**
 * @typedef {Object} TWEEN_OPTIONS
 * @property {number} [duration]
 * @property {number} [delay]
 * @property {number} [space]
 * @property {string} [ease]
 * @property {PROPERTIES} [props]
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
 * @property {HTMLElement} [container]
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
 * @property {NODE} [trigger]
 * @property {PROPERTIES} [animate]
 * @property {TWEEN_OPTIONS} [tween]
 * @property {string} [ease]
 * @property {string|number} [start]
 * @property {string|number} [end]
 * @property {{start:string|number, end:start|number}} [pin]
 * @property {Function} [onUpdate]
 */
