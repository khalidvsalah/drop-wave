import window from '../../__utilities__/dom';
import { setProp } from '../../../src/Utils/methods/css';

const p = window.document.querySelector('p');

describe('A set of css properties', () => {
  it('Opacity', () => {
    setProp.alpha(p, 0);
    expect(p.style.opacity).toBe('0');
  });

  it('display', () => {
    setProp.display(p, 'none');
    expect(p.style.display).toBe('none');
  });

  it('pointer', () => {
    setProp.pointer(p, 'all');
    expect(p.style.pointerEvents).toBe('all');
  });

  it('position', () => {
    setProp.position(p, 'fixed');
    expect(p.style.position).toBe('fixed');
  });

  it('visibility', () => {
    setProp.visible(p, 'hidden');
    expect(p.style.visibility).toBe('hidden');
  });
});
