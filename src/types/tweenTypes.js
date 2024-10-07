/**
 * Tween options
 * @typedef {Object} TWEEN_OPTIONS
 * @property {number} duration - Duration of the animation.
 * @property {number} delay - Delay before starting the animation.
 * @property {number} space - Additional delay for each element.
 * @property {Object} props - Properties to animate.
 * @property {Function} onStart - Callback for when the animation starts.
 * @property {Function} onUpdate - Callback for each update/frame of the animation.
 * @property {Function} onComplete - Callback when the animation finishes.
 */

/**
 * Tween Controllers
 * @typedef {Object} TWEEN_CONTROLLERS
 * @property {Function} play - Method to start the animation.
 * @property {Function} reverse - Method to reverse the animation.
 * @property {Function} pause - Method to pause the animation.
 * @property {Function} kill - Method to stop and clean up the animation.
 */

/**
 * Scroll options
 * @typedef {Object} SCROLL_OPTIONS
 * @property {string} name
 * @property {string} dir
 * @property {object} container
 * @property {boolean} wheel
 * @property {boolean} key
 * @property {boolean} drag
 * @property {boolean} infinite
 * @property {number} speed
 * @property {Function} onUpdate
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

export type {
  TWEEN_OPTIONS,
  TWEEN_CONTROLLERS,
  SCROLL_OPTIONS,
  TRIGGER_OPTIONS,
};
