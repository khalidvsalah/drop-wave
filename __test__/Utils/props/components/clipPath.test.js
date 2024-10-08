import '../../../__utilities__/dom';
import clipPath from '../../../../src/Utils/props/components/properties/clipPath';

const prag = document.querySelector('p');
let computed = { clipPath: 'none' };

describe('Clip Path', () => {
  it('Clip Path tween function', () => {
    const result = clipPath(
      { circle: ['50 at 50 50', '0 at 50 50'] },
      { computed }
    );
    expect(result).toEqual(expect.any(Function));
  });

  it('check element style: circle', () => {
    prag.style.clipPath = 'circle(50 at 50 50)';
    const result = clipPath(
      { circle: ['50 at 50 50', '0 at 50 50'] },
      { computed }
    );
    expect(result(1)).toBe('circle(0% at 50% 50%)');
  });

  it('check element style: polygon', () => {
    prag.style.clipPath = 'polygon(0 0, 0% 100%, 100% 100%)';
    const result = clipPath(
      {
        polygon: ['0 0, 0% 100%, 100% 100%', '50% 0, 0% 100%, 100% 100%'],
      },
      { computed }
    );
    expect(result(1)).toBe('polygon(50% 0%, 0% 100%, 100% 100%)');
  });
});
