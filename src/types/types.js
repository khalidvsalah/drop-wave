/** * @typedef {NodeList|Node|HTMLElement|Array} ELEMENTS */
/** * @typedef {string|Array<string>} STRING_ARR */
/** * @typedef {string|Array<number>} NUMBER_ARR */

/* Start Properties */
/** * @typedef {{x:STRING_ARR, y:STRING_ARR, scale:NUMBER_ARR, scaleX:NUMBER_ARR, scaleY:NUMBER_ARR}} transformType */
/** * @typedef {{circle:FROM_TO, polygon:FROM_TO}} clipPathType */
/* End Properties */

/**
 * elementContextType
 * @typedef {object} elementContextType
 * @property {Node} element - the element
 * @property {CSSStyleDeclaration} computed - computed style
 * @property {Node} parent - parent node
 */

/**
 * Tweened Properties
 * @typedef {object} propertiesType
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
 * @typedef {object} tweenOptionsType
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
 * @typedef {object} tweenReturnsType
 * @property {Function} reverse
 * @property {Function} play
 * @property {Function} pause
 * @property {Function} kill
 */

/**
 * Timeline options
 * @typedef {object} timelineOptionsType
 * @property {number} [delay]
 * @property {string|symbol} [name]
 */

/**
 * Virtual Scroll Options
 * @typedef {object} scrollOptionsType
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
 * @typedef {object} triggerOptionsType
 * @property {ELEMENTS} [trigger]
 * @property {propertiesType} [animate]
 * @property {tweenOptionsType} [tween]
 * @property {string} [ease]
 * @property {string|number|Function} [start]
 * @property {string|number|Function} [end]
 * @property {{start:string|number|Function, end:start|number|Function}} [pin]
 * @property {Function} [onUpdate]
 */
