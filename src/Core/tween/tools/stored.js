const store = new Map();

/**
 * @param {HTMLElement} element - targeted element
 * @param {object} tweenClass - targeted element
 * @returns {object} targeted element
 */
export default function stored(element, tweenClass) {
  let stored = store.get(element);

  if (!stored) {
    store.set(element, tweenClass);
    tweenClass.init(element);
    return tweenClass;
  } else return stored;
}
