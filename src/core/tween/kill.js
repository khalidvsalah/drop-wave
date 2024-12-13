import selector from '../../helpers/selector';
import { TWEENS_STORAGE } from './helpers';

export const kill = (elements) => {
  elements = selector(elements);
  elements.forEach((element) => {
    if (TWEENS_STORAGE.has(element)) {
      const tween = TWEENS_STORAGE.get(element);
      tween._stop();
      tween.delay._destroy();
    }
  });
};
