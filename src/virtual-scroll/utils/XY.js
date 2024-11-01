import { css } from '../../methods/css.js';

const XY = (element, value, isVertical) => {
  if (isVertical) {
    css.set(element, 'transform', `translate3d(0, ${value}px, 0)`);
  } else {
    css.set(element, 'transform', `translate3d(${value}px, 0, 0)`);
  }
};

export default XY;
