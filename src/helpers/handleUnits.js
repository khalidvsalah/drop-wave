import { win } from '../methods/window';

export const getValue = (value) => value.match(/^([+|-]?\d+)/g);
export const getUnit = (value) => value.match(/(%|px|vw|vh)/g) || ['px'];

export function toPixels(value, size) {
  if (typeof value === 'string') {
    const number = +getValue(value);
    const unit = getUnit(value)[0];

    switch (unit) {
      case 'px':
        return { pixels: number, unit: 'px' };
      case '%':
        if (typeof size !== 'number') {
          throw TypeError('Please Provide the (width / height) of the element');
        }
        return { pixels: (number * size) / 100, unit: '%' };
      case 'vw':
        return { pixels: (number * win.screen.w) / 100, unit: 'vw' };
      case 'vh':
        return { pixels: (number * win.screen.h) / 100, unit: 'vh' };
      default:
        return { pixels: number, unit: 'px' };
    }
  } else if (typeof value === 'number') {
    return toPixels(value.toString());
  } else {
    throw TypeError('Please Provide valid input (string, number)');
  }
}

export function unitConventer(value, size, newUnit) {
  const { pixels } = toPixels(value, size);
  switch (newUnit) {
    case 'px':
      return { value: pixels, unit: 'px' };
    case '%':
      return { value: (pixels / size) * 100, unit: '%' };
    case 'vw':
      return { value: (pixels / win.screen.w) * 100, unit: 'vw' };
    case 'vh':
      return { value: (pixels / win.screen.h) * 100, unit: 'vh' };
    default:
      return { value: pixels, unit: 'px' };
  }
}
