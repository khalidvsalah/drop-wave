import './late.setup';
import { Late } from '../../../src/index';

test('Late Class', async () => {
  const mock = jest.fn(x => 42 + x);
  const d = 0; // 0.1 second
  const delay = new Late({ d, cb: mock });
  delay.play();

  await new Promise(resolve => {
    setTimeout(() => {
      expect(mock.mock.calls).toHaveLength(1);
      resolve();
    }, d * 1000);
  });
});
