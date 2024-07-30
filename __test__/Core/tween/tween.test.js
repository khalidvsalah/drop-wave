import window from '../../__utilities__/dom';
import '../late/late.setup';
import { computed } from '../../../src/index';
import { tween } from '../../../src/Core/tween/tween';

const prag = window.document.querySelector('p');

describe('Tween', () => {
  it('HTMLElment', () => {
    tween(prag, {
      dur: 0,
      late: 0,
      props: { opacity: [0, 1] }
    });
    console.log(prag.style.opacity);
  });
});
