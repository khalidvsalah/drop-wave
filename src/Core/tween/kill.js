import { storage, store } from '../../Utils/states/storage';

export const kill = (element) => {
  element =
    typeof element === 'string' ? document.querySelector(element) : element;
  if (storage.has(element)) {
    console.log(store(element).delay);
    store(element).stop();
  }
};
