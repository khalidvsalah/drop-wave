import window from '../../__utilities__/dom';
import { props, addProperty } from '../../../src/index';

const prag = window.document.querySelector('p');

describe('props', () => {
  it('HTMLElement', () => {
    const result = props(prag, { opacity: [0, 1] });
    expect(result).toMatchObject([
      { setValue: expect.any(Function), cb: expect.any(Function) }
    ]);
  });

  it('Object', () => {
    const obj = { y: { value: 0 } };
    const result = props(obj.y, { value: [0, 1] });
    expect(result).toMatchObject([
      {
        setValue: expect.any(Function),
        cb: expect.any(Function)
      }
    ]);
  });

  it('Add new tweened property', () => {
    const mock = jest.fn(x => 42 + x);
    addProperty('blur', {
      property: mock,
      setValue: (element, value) => (element.style.filter = value)
    });

    props(prag, { blur: [0, 1] });
    expect(mock.mock.calls).toHaveLength(1);
  });
});
