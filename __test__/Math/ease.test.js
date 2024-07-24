import '../__utilities__/dom';
import { ease } from '../../src/index';

describe('Easing', () => {
  it('Normal Easing', () => {
    expect(ease('io3')).toBeInstanceOf(Function);
  });

  it('Custom Easing', () => {
    expect(ease([0.7, 1, 0.2, 0.8])).toBeInstanceOf(Function);
  });

  it('Passing invalid values', () => {
    expect(ease('p')).toBeUndefined(); // not [i, o, io]
    expect(ease({})).toBeUndefined(); // not [i, o, io]
  });
});
