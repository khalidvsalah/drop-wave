import '../__utilities__/dom';
import { register } from '../../src/index';

describe('Register New CSS Property', () => {
  it('Existing property', () => {
    expect(register.check('move')).toBe(true);
  });

  it('Not existing property', () => {
    expect(register.check('height')).toBe(false);
  });

  it('push a new property', () => {
    register.push('height', {
      CSSName: 'height',
      TweenFn: () => true,
    });
    expect(register.check('height')).toBe(true);
  });
});
