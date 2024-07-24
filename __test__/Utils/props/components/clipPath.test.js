import window from '../../../__utilities__/dom';
import clipPath from '../../../../src/Utils/props/components/clipPath';

const prag = window.document.querySelector('p');

describe('Clip Path', () => {
  it('Clip Path tween function', () => {
    const result = clipPath.propery({ circle: ['50 at 50 50', '0 at 50 50'] });
    expect(result).toEqual(expect.any(Function));
  });

  it('check element style: circle', () => {
    prag.style.clipPath = 'circle(50 at 50 50)';
    const result = clipPath.propery({ circle: ['50 at 50 50', '0 at 50 50'] });
    clipPath.setValue(prag, result(1));
    expect(prag.style.clipPath).toBe('circle(0 at 50 50)');
  });

  it('check element style: polygon', () => {
    prag.style.clipPath = 'polygon(0 0, 0% 100%, 100% 100%)';
    const result = clipPath.propery({
      polygon: ['0 0, 0% 100%, 100% 100%', '50% 0, 0% 100%, 100% 100%']
    });
    clipPath.setValue(prag, result(1));
    expect(prag.style.clipPath).toBe('polygon(50% 0%, 0% 100%, 100% 100%)');
  });
});
