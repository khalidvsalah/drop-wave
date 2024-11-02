import { tweensStorage } from './tween';

export const kill = (elements) => {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  } else if (elements instanceof Node) {
    elements = [elements];
  }

  elements.forEach((element) => {
    if (tweensStorage.has(element)) {
      tweensStorage.get(element).stop();
    }
  });
};
