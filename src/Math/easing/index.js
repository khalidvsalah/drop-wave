import customEasing from './custom';
import easingFunctions from './easingFunctions';

export const easingFn = new Proxy(easingFunctions, {
  get(target, prop) {
    return target[prop] || customEasing(prop);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
});
