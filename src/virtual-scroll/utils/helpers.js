import { css } from '../../methods/css';

export const CSSTransform = (element, value, isVertical) => {
  if (isVertical) {
    css.set(element, 'transform', `translate3d(0, ${value}px, 0)`);
  } else {
    css.set(element, 'transform', `translate3d(${value}px, 0, 0)`);
  }
};

export const inRange = (child, { topBar, bottomBar }, coords, scroll, isY) => {
  if (topBar <= coords.end && bottomBar >= coords.start) {
    CSSTransform(child, -scroll, isY);
    coords.out = false;
  } else if (!coords.out) {
    CSSTransform(child, -scroll, isY);
    coords.out = true;
  }
};
