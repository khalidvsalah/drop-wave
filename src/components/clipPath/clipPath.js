import { _circle, _polygon, _inset } from './clipPathBase';

/**
 * @param {object} endValue
 * @param {elementContextType}
 * @return {Function}
 */
function clipPath(endValue, { element, computed }) {
  let shape = /(.*)\((.*)\)/.exec(endValue);
  let startValue = computed.clipPath;
  shape = shape || /(.*)\((.*)\)/.exec(startValue);

  switch (shape[1]) {
    case 'circle': {
      if (startValue === 'none') {
        startValue = '100 at 50 50';
      }
      if (endValue === 'none') {
        endValue = '100 at 50 50';
      }
      const circle = _circle(startValue, endValue, element);
      return (t) => `circle(${circle(t)})`;
    }
    case 'polygon': {
      if (startValue === 'none') {
        startValue = '0 0, 100 0, 100 100, 0 100';
      }
      if (endValue === 'none') {
        endValue = '0 0, 100 0, 100 100, 0 100';
      }
      const polygon = _polygon(startValue, endValue, element);
      return (t) => `polygon(${polygon(t)})`;
    }
    case 'inset': {
      if (startValue === 'none') {
        startValue = '0 0 0 0';
      }
      if (endValue === 'none') {
        endValue = '0 0 0 0';
      }
      const inset = _inset(startValue, endValue, element);
      return (t) => `inset(${inset(t)})`;
    }
  }
}

export default {
  name: 'clipPath',
  callback: clipPath,
};
