import '../../__utilities__/dom';
import { states } from '../../../src/index';

describe('Testing states class', () => {
  it('check calls length', () => {
    const mock = jest.fn(x => 42 + x);
    const onclick = states.create('onclick');
    states.subscribe('onclick', mock);

    onclick.notify();
    onclick.notify();

    expect(mock.mock.calls).toHaveLength(2);
  });

  it('check calls length on different events', () => {
    const mock = jest.fn(x => 42 + x);

    const onkey = states.create('onkey');
    const onmove = states.create('onmove');

    onmove.notify();
    states.subscribe('onkey', mock);
    onkey.notify();

    expect(mock.mock.calls).toHaveLength(1);
  });

  it('check calls length on remove', () => {
    const mock = jest.fn(x => 42 + x);
    const onscroll = states.create('onscroll');
    const remove = states.subscribe('onscroll', mock);

    remove.remove();
    onscroll.notify();
    expect(mock.mock.calls).toHaveLength(0);
  });

  it('multiple subscribtion', () => {
    const mock1 = jest.fn(x => 42 + x);
    const mock2 = jest.fn(x => 42 + x);

    const ondrag = states.create('ondrag');

    states.subscribe('ondrag', mock1);
    states.subscribe('ondrag', mock2);

    ondrag.notify();

    expect(mock1.mock.calls).toHaveLength(1);
    expect(mock2.mock.calls).toHaveLength(1);
  });

  it('remove second subscribed fun', () => {
    const mock1 = jest.fn(x => 42 + x);
    const mock2 = jest.fn(x => 42 + x);

    const onmousedown = states.create('onmousedown');

    states.subscribe('onmousedown', mock1);
    const remove = states.subscribe('onmousedown', mock2);

    remove.remove();
    onmousedown.notify();

    expect(mock1.mock.calls).toHaveLength(1);
    expect(mock2.mock.calls).toHaveLength(0);
  });

  it('check for states', () => {
    expect(states.check('onmousedown')).toBeTruthy();
    expect(states.check('onclick')).toBeTruthy();
    expect(states.check('raf')).toBeFalsy();
  });

  it('remove states', () => {
    const raf = states.create('raf');
    raf.remove();
    expect(states.check('raf')).toBeFalsy();
  });
});
