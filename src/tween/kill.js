import { tweensStorage } from './tween';

export const kill = (element) => {
  element =
    typeof element === 'string' ? document.querySelector(element) : element;
  if (tweensStorage.has(element)) {
    tweensStorage.get(element).stop();
  }
};
