import window from '../../../__utilities__/dom';
import transform from '../../../../src/Utils/props/components/transform';

const prag = window.document.querySelector('p');

describe('Transform', () => {
  it('transform tween function', () => {
    const result = transform.property({ x: [0, 100, 'px'] });
    expect(result).toEqual(expect.any(Function));
  });

  it('check element style', () => {
    const result = transform.property({ x: [0, 100, 'px'] });
    transform.setValue(prag, result(1));
    expect(prag.style.transform).toBe('translate3d(100px, 0, 0)');
  });
});
