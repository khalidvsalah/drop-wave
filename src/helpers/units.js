import { win } from '../methods/window';

export function units(value, height) {
  if (typeof value === 'string') {
    const unit = /^([+|-]?\d+)(%|px|vw|vh)?/.exec(value);
    if (unit) {
      const number = +unit[1];
      switch (unit[2]) {
        case 'px':
          return number;
        case '%':
          return (number * height) / 100;
        case 'vw':
          return (number * win.screen.w) / 100;
        case 'vh':
          return (number * win.screen.h) / 100;
        default:
          return number;
      }
    }
  } else {
    return value;
  }
}
