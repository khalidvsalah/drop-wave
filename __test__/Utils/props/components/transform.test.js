import '../../../__utilities__/dom';
import transform from '../../../../src/Utils/props/components/properties/transform';

const parent = document.querySelector('main');
const child = document.querySelector('p');
let computed = { transform: 'none' };

describe('Transform', () => {
  it('transform tween function', () => {
    const result = transform(
      { x: [0, 100, 'px'] },
      { computed, element: child, parent }
    );
    expect(result).toEqual(expect.any(Function));
  });

  it('check element style', () => {
    const result = transform(
      { x: [0, 100, 'px'] },
      { computed, element: child, parent }
    );
    expect(result(1)).toBe('translate3d(100px, 0px, 0) scale(1, 1)');
  });
});
