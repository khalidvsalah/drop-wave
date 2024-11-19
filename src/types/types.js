/** * @typedef {NodeList|Node|HTMLElement|Array} ELEMENTS */
/** * @typedef {string|Array<string>} STRING_ARR */
/** * @typedef {string|Array<number>} NUMBER_ARR */

/* Start Properties */
/** * @typedef {{x:STRING_ARR, y:STRING_ARR, scale:NUMBER_ARR, scaleX:NUMBER_ARR, scaleY:NUMBER_ARR}} transformType */
/** * @typedef {{circle:FROM_TO, polygon:FROM_TO}} clipPathType */
/* End Properties */

/**
 * Tweened Properties
 * @typedef {Object} propertiesType
 * @property {number} [opacity]
 * @property {number} [alpha]
 * @property {transformType} [transform]
 * @property {transformType} [move]
 * @property {clipPathType} [clip]
 * @property {clipPathType} [clipPath]
 * @property {{gray:FROM_TO, blur:FROM_TO, contrast:FROM_TO}} [filter]
 * @property {NUMBER_ARR} [draw]
 * @property {string} [points]
 * @property {string} [path]
 */

/**
 * Tween Options
 * @typedef {Object} tweenOptionsType
 * @property {number} [duration]
 * @property {number} [delay]
 * @property {number} [space]
 * @property {string} [ease]
 * @property {propertiesType} [props]
 * @property {Function} [onStart]
 * @property {Function} [onUpdate]
 * @property {Function} [onComplete]
 */

/**
 * Tween returned Object
 * @typedef {Object} tweenReturnsType
 * @property {Function} reverse
 * @property {Function} play
 * @property {Function} pause
 * @property {Function} kill
 */

/**
 * Virtual Scroll Options
 * @typedef {Object} scrollOptionsType
 * @property {string} [name]
 * @property {HTMLElement} [container]
 * @property {'x'|'y'} [dir]
 * @property {boolean} [drag]
 * @property {boolean} [wheel]
 * @property {boolean} [key]
 * @property {number} [speed]
 * @property {boolean} [infinite]
 */

/**
 * Trigger options
 * @typedef {Object} triggerOptionsType
 * @property {ELEMENTS} [trigger]
 * @property {propertiesType} [animate]
 * @property {tweenOptionsType} [tween]
 * @property {string} [ease]
 * @property {string|number|Function} [start]
 * @property {string|number|Function} [end]
 * @property {{start:string|number|Function, end:start|number|Function}} [pin]
 * @property {Function} [onUpdate]
 */

/**
 * Timeline options
 * @typedef {Object} timelineOptionsType
 * @property {number} [delay]
 * @property {string|symbol} [name]
 */
