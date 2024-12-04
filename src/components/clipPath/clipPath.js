import { _circle, _polygon, _inset } from './clipPathBase';

/**
 * Clip Path default value.
 */
const defaults = {
  circle: '100 at 50 50',
  polygon: '0 0, 100 0, 100 100, 0 100',
  inset: '0 0 0 0',
};

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
      if (startValue === 'none') startValue = defaults.circle;
      if (endValue === 'none') endValue = defaults.circle;
      const circle = _circle(startValue, endValue, element);
      return (t) => `circle(${circle(t)})`;
    }
    case 'polygon': {
      if (startValue === 'none') startValue = defaults.polygon;
      if (endValue === 'none') endValue = defaults.polygon;
      const polygon = _polygon(startValue, endValue, element);
      return (t) => `polygon(${polygon(t)})`;
    }
    case 'inset': {
      if (startValue === 'none') startValue = defaults.inset;
      if (endValue === 'none') endValue = defaults.inset;
      const inset = _inset(startValue, endValue, element);
      return (t) => `inset(${inset(t)})`;
    }
  }
}

export default {
  name: 'clipPath',
  callback: clipPath,
};
