import line from '../../dist/plugins/index.js';
import { iSet } from '../../dist/main.js';

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    line(iSet.el('.logo'), { letters: true });
  }
});
