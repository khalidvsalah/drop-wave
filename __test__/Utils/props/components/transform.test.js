import window from '../../../__utilities__/dom';
import transform from '../../../../src/Utils/props/components/transform';

const prag = window.document.querySelector('p');

describe('Transform', () => {
  it('transform tween function', () => {
    const result = transform.callback({ x: [0, 100, 'px'] });
    expect(result).toEqual(expect.any(Function));
  });

  it('check element style', () => {
    const result = transform.callback({ x: [0, 100, 'px'] });
    expect(result(1)).toBe('translate3d(100px, 0, 0)');
  });
});
