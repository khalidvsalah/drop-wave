import '../../../__utilities__/dom';
import opacity from '../../../../src/components/opacity';

const prag = document.querySelector('p');
let computed = { opacity: '1' };

describe('Opacity', () => {
  it('opacity tween function', () => {
    const result = opacity([0, 1], { computed });
    expect(result).toEqual(expect.any(Function));
  });

  it('element opacity to equal 1', () => {
    prag.style.opacity = 1;
    const result = opacity(0, { computed });
    expect(result(1)).toBe('0');
  });
});
