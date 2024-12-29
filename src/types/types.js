/**
 * DOM Element or Selector String
 * @typedef {HTMLElement|string} DOMSelector
 */

/**
 * DOMElementContext
 * @typedef {object} DOMElementContext
 * @property {Node} element - targeted element
 * @property {CSSStyleDeclaration} computed - computed style
 * @property {Node} parent - parent node
 */

/**
 * Tweened Properties
 * @typedef {object} propertiesType
 * @property {number} [opacity]
 * @property {object} [transform]
 * @property {string} [clipPath]
 * @property {string} [filter]
 * @property {number} [draw]
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
 * @property {propertiesType} [to]
 * @property {propertiesType} [from]
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
 * @property {HTMLElement} [wrapper]
 * @property {number} [multiplier]
 * @property {'x'|'y'} [dir]
 * @property {boolean} [drag]
 * @property {boolean} [wheel]
 * @property {boolean} [key]
 * @property {number} [ease]
 * @property {boolean} [infinite]
 */

/**
 * Trigger options
 * @typedef {object} triggerOptionsType
 * @property {any} [target]
 * @property {any} [container]
 * @property {propertiesType} [animate]
 * @property {tweenOptionsType} [tween]
 * @property {string} [ease]
 * @property {string|number|Function} [start]
 * @property {string|number|Function} [end]
 * @property {{start:string|number|Function, end:start|number|Function}} [pin]
 * @property {Function} [onUpdate]
 */
