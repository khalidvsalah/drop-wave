import window from '../../__utilities__/dom';
import { prepare } from '../../../src/index';

const prag = window.document.querySelector('p');

describe('prepare', () => {
  it('HTMLElement', () => {
    const result = prepare(prag, { opacity: [0, 1] });
    expect(result).toMatchObject([
      { setValue: expect.any(Function), cb: expect.any(Function) },
    ]);
  });

  it('Object', () => {
    const box = { y: { value: 0 } };
    const result = prepare(box, { y: { value: [0, 1] } });
    expect(result).toMatchObject([
      {
        setValue: expect.any(Function),
        cb: expect.any(Function),
      },
    ]);
  });
});
