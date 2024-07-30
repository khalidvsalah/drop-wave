import '../../__utilities__/dom';
import { Choke } from '../../../src/index';

const mock = jest.fn(x => 42 + x);

test('Check calls', async () => {
  const d = 0.1; // 0.1 second
  const c = new Choke({ d, cb: mock });
  c.run();

  await new Promise(resolve => {
    setTimeout(() => {
      expect(mock.mock.calls).toHaveLength(1);
      resolve();
    }, d * 1000);
  });
});
