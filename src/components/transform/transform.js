import { bounds } from '../../methods/coordinate';
import { _translate, _scale, _rotate } from './transformBase';
import { matrix2d, matrix3d } from './transformMatrix';

/**
 * Transform default value.
 */
const defaults = {
  translate: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
  rotate: { x: 0, y: 0, z: 0 },
};

/**
 * Parse tranform value to (translate, scale, rotate).
 *
 * @param {string} value
 * @returns {object}
 */
const parseTransform = (value) => {
  if (value.scale != null) {
    [value.scaleX, value.scaleY] = [value.scale, value.scale];
  }
  if (value.rotate != null) {
    value.rotateZ = value.rotate;
  }

  if (typeof value === 'string') {
    if (value === 'none') {
      value = defaults;
    } else {
      const isMatrix3d = /3d/.exec(value);
      const matrix = /\((.*)\)/.exec(value);
      value = isMatrix3d ? matrix3d(matrix) : matrix2d(matrix);
    }
  } else {
    value = {
      translate: { x: value.x, y: value.y },
      scale: { x: value.scaleX, y: value.scaleY },
      rotate: { x: value.rotateX, y: value.rotateY, z: value.rotateZ },
    };
  }

  return value;
};

/**
 * Return the first defined value.
 * @param {number|string} values
 * @returns {number|string}
 */
const isNumber = (o1, o2, o3) => {
  return o1 != null ? o1 : o2 != null ? o2 : o3;
};

/**
 * Fill undefined values.
 *
 * @param {string} value
 * @returns {object}
 */
const fill = (value, fillValue) => {
  return {
    translate: {
      x: isNumber(
        value.translate.x,
        fillValue.translate.x,
        defaults.translate.x
      ),
      y: isNumber(
        value.translate.y,
        fillValue.translate.y,
        defaults.translate.y
      ),
    },
    scale: {
      x: isNumber(value.scale.x, fillValue.scale.x, defaults.scale.x),
      y: isNumber(value.scale.y, fillValue.scale.y, defaults.scale.y),
    },
    rotate: {
      x: isNumber(value.rotate.x, fillValue.rotate.x, defaults.rotate.x),
      y: isNumber(value.rotate.y, fillValue.rotate.y, defaults.rotate.y),
      z: isNumber(value.rotate.z, fillValue.rotate.z, defaults.rotate.z),
    },
  };
};

/**
 * @param {object} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const transform = (endValue, { element, computed }) => {
  let startValue = computed.transform;

  const width = element.offsetWidth || bounds(element).w;
  const height = element.offsetHeight || bounds(element).h;

  startValue = parseTransform(startValue);
  endValue = parseTransform(endValue);

  startValue = fill(startValue, endValue);
  endValue = fill(endValue, startValue);

  const arr = [];

  if (
    endValue.translate.x != null ||
    endValue.translate.y != null ||
    startValue.translate.x != null ||
    startValue.translate.y != null
  ) {
    arr.push(
      _translate(
        [endValue.translate.x, endValue.translate.y],
        [startValue.translate.x, startValue.translate.y],
        [width, height]
      )
    );
  }

  if (
    endValue.scale.x != 1 ||
    endValue.scale.y != 1 ||
    startValue.scale.x != 1 ||
    startValue.scale.y != 1
  ) {
    arr.push(
      _scale(
        [endValue.scale.x, endValue.scale.y],
        [startValue.scale.x, startValue.scale.y]
      )
    );
  }

  if (
    endValue.rotate.x != 0 ||
    endValue.rotate.y != 0 ||
    endValue.rotate.z != 0 ||
    startValue.rotate.x != 0 ||
    startValue.rotate.y != 0 ||
    startValue.rotate.z != 0
  ) {
    arr.push(
      _rotate(
        [endValue.rotate.x, endValue.rotate.y, endValue.rotate.z],
        [startValue.rotate.x, startValue.rotate.y, startValue.rotate.z]
      )
    );
  }

  return (t) => arr.map((a) => a(t)).join(' ');
};

export default {
  name: 'transform',
  callback: transform,
};
