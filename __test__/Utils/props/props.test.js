import window from '../../__utilities__/dom';
import { Prepare, register } from '../../../src/index';

const prag = window.document.querySelector('p');

describe('prepare', () => {
  it('HTMLElement', () => {
    const properties = new Prepare(prag);
    const result = properties.props({ opacity: [0, 1] });

    expect(result).toMatchObject([
      { setValue: expect.any(Function), cb: expect.any(Function) }
    ]);
  });

  it('Object', () => {
    const properties = new Prepare(obj);
    const obj = { y: { value: 0 } };
    const result = properties.props({ value: [0, 1] });
    expect(result).toMatchObject([
      {
        setValue: expect.any(Function),
        cb: expect.any(Function)
      }
    ]);
  });

  it('Add new tweened property', () => {
    const properties = new Prepare(prag);
    const mock = jest.fn(x => 42 + x);

    register('blur', {
      property: 'filter',
      callback: mock
    });

    properties.props({ blur: [0, 1] });
    expect(mock.mock.calls).toHaveLength(1);
  });
});
