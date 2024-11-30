import { win } from '../methods/window';
import { UNITS, NUMERIC } from './regex';

const VALUE_REGEX = new RegExp('^[+|-]?' + NUMERIC, 'g');
const UNITS_REGEX = new RegExp('(' + UNITS + ')', 'g');

/**
 * @param {string} value
 * @returns {Array<string>}
 */
export const getValue = (value) => {
  if (typeof value === 'string') {
    value = value.match(VALUE_REGEX);
    return value && +value[0];
  }
};

/**
 * @param {string} value
 * @returns {Array<string>}
 */
export const getUnit = (value) => {
  if (typeof value === 'string') {
    value = value.match(UNITS_REGEX);
    return value && value[0];
  }
};

/**
 *  Convert [%, vw, vh] values to pixels.
 * @param {string|number} value
 * @param {number} size
 * @returns {{pixels:number, unit:string}}
 */
export function toPixels(value, size) {
  if (typeof value === 'string') {
    const number = getValue(value) || 0;
    const unit = getUnit(value);

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

/**
 *  Convert pixels to [%, vw, vh] value.
 * @param {string|number} value
 * @param {number} size
 * @param {string} newUnit
 * @returns {{pixels:number, unit:string}}
 */
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
