import window from '../../../__utilities__/dom';
import opacity from '../../../../src/Utils/props/components/opacity';

const prag = window.document.querySelector('p');

describe('Opacity', () => {
  it('opacity tween function', () => {
    const result = opacity.callback([0, 1]);
    expect(result).toEqual(expect.any(Function));
  });

  it('element opacity to equal 1', () => {
    prag.style.opacity = 0;
    const result = opacity.callback([0, 1]);
    opacity.setValue(prag, result(1));
    expect(result(1)).toBe('1');
  });
});
