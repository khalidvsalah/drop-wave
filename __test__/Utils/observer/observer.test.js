import '../../__utilities__/dom';
import { observer } from '../../../src/index';

describe('Testing observer class', () => {
  it('check calls length', () => {
    const mock = jest.fn((x) => 42 + x);
    const onclick = observer.create('onclick');
    observer.subscribe('onclick', mock);

    onclick.notify();
    onclick.notify();

    expect(mock.mock.calls).toHaveLength(2);
  });

  it('check calls length on different events', () => {
    const mock = jest.fn((x) => 42 + x);

    const onkey = observer.create('onkey');
    const onmove = observer.create('onmove');

    onmove.notify();
    observer.subscribe('onkey', mock);
    onkey.notify();

    expect(mock.mock.calls).toHaveLength(1);
  });

  it('check calls length on remove', () => {
    const mock = jest.fn((x) => 42 + x);
    const onscroll = observer.create('onscroll');
    const remove = observer.subscribe('onscroll', mock);

    remove.unsubscribe();
    onscroll.notify();
    expect(mock.mock.calls).toHaveLength(0);
  });

  it('multiple subscribtion', () => {
    const mock1 = jest.fn((x) => 42 + x);
    const mock2 = jest.fn((x) => 42 + x);

    const ondrag = observer.create('ondrag');

    observer.subscribe('ondrag', mock1);
    observer.subscribe('ondrag', mock2);

    ondrag.notify();

    expect(mock1.mock.calls).toHaveLength(1);
    expect(mock2.mock.calls).toHaveLength(1);
  });

  it('remove second subscribed fun', () => {
    const mock1 = jest.fn((x) => 42 + x);
    const mock2 = jest.fn((x) => 42 + x);

    const onmousedown = observer.create('onmousedown');

    observer.subscribe('onmousedown', mock1);
    const remove = observer.subscribe('onmousedown', mock2);

    remove.unsubscribe();
    onmousedown.notify();

    expect(mock1.mock.calls).toHaveLength(1);
    expect(mock2.mock.calls).toHaveLength(0);
  });

  it('check for observer', () => {
    expect(observer.check('onmousedown')).toBeTruthy();
    expect(observer.check('onclick')).toBeTruthy();
    expect(observer.check('raf')).toBeFalsy();
  });

  it('remove observer', () => {
    const raf = observer.create('raf');
    raf.remove();
    expect(observer.check('raf')).toBeFalsy();
  });
});
