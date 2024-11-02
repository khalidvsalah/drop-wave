import { tweensStorage } from './tween';

export const kill = (elements) => {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  } else if (elements instanceof Node) {
    elements = [elements];
  }

  elements.forEach((element) => {
    if (tweensStorage.has(element)) {
      const tween = tweensStorage.get(element);
      tween.stop();
      tween.delay.destroy();
    }
  });
};
