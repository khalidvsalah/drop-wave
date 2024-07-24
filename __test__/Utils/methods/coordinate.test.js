import window from '../../__utilities__/dom';
import { bounds, offset } from '../../../src/index';

const p = window.document.querySelector('p');

test('getBoundingClientRect', () => {
  expect(bounds(p)).toMatchObject({
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    xE: 0,
    yE: 0
  });
});

test('offset', () => {
  expect(offset(p)).toMatchObject({
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    xE: 0,
    yE: 0
  });
});
