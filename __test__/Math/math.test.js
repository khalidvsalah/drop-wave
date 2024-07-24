import '../__utilities__/dom';
import { clamp, lerp, map, remap } from '../../src/index';

describe('Math Functions', () => {
  it('Clamp', () => {
    expect(clamp(0, 1, 0.5)).toBe(0.5);
    expect(clamp(0, 1, -0.5)).toBe(0);
  });

  it('Lerp', () => {
    expect(lerp(0, 1, 0.5)).toBe(0.5);
    expect(lerp(2, 1, 0.5)).toBe(1.5);
  });

  it('Map', () => {
    expect(map(0, 100, 25)).toBe(0.25);
    expect(map(50, 100, 75)).toBe(0.5);
  });

  it('Remap', () => {
    expect(remap(0, 100, 0, 10, 50)).toBe(5);
    expect(remap(0, 5, 0, 100, 3)).toBe(60);
  });
});
