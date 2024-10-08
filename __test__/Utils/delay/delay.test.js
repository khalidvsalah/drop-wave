import '../../__utilities__/dom';
import { Delay } from '../../../src/index';

describe('Delay', () => {
  test('Fire after 1000 millisecond', async () => {
    const mock = jest.fn((x) => 42 + x);
    const delay = new Delay({ d: 0.1, cb: mock });
    delay.play();

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(mock.mock.calls).toHaveLength(1);
        resolve();
      }, 120);
    });
  });

  test('destroy before time', async () => {
    const mock = jest.fn((x) => 42 + x);
    const delay = new Delay({ d: 0.1, cb: mock });
    delay.play();

    delay.destroy();

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(mock.mock.calls).toHaveLength(0);
        resolve();
      }, 110);
    });
  });
});
