/** * @typedef {string|Node|NodeList|HTMLCollection|Array<Node|number>|object} DOMSelector */

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
 * @property {transformType} [transform]
 * @property {clipPathType} [clipPath]
 * @property {string} [filter]
 * @property {string|Node} [draw]
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
 * @property {DOMSelector} [target]
 * @property {tweenOptionsType} [tween]
 * @property {tweenOptionsType} [animate]
 * @property {string|number|Function} [start]
 * @property {string|number|Function} [end]
 * @property {boolean | {start:string|number|Function, end:start|number|Function}} [pin]
 * @property {Function} [onEnter]
 * @property {Function} [onLeave]
 * @property {Function} [onEnterBack]
 * @property {Function} [onLeaveBack]
 * @property {Function} [onUpdate]
 */
