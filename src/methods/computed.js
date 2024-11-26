const COMPUTED_STORE = new WeakMap();

/**
 * @param {HTMLElement} element
 */
export const computed = (element) => {
  let eleStyle;
  if ((eleStyle = COMPUTED_STORE.get(element))) {
    return eleStyle;
  } else {
    eleStyle = window.getComputedStyle(element);
    COMPUTED_STORE.set(element, eleStyle);
    return eleStyle;
  }
};
