import window from '../../__utilities__/dom';
import { processing } from '../../../src/index';

const prag = window.document.querySelector('p');

describe('prepare', () => {
  it('HTMLElement', () => {
    const result = processing(prag, { opacity: [0, 1] });
    expect(result).toMatchObject([
      { setValue: expect.any(Function), cb: expect.any(Function) },
    ]);
  });

  it('Object', () => {
    const box = { y: { value: 0 } };
    const result = processing(box, { y: { value: [0, 1] } });
    expect(result).toMatchObject([
      {
        setValue: expect.any(Function),
        cb: expect.any(Function),
      },
    ]);
  });
});
