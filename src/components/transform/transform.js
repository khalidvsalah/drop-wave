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
  }

  return {
    translate: { x: value.x, y: value.y },
    scale: { x: value.scaleX, y: value.scaleY },
    rotate: { x: value.rotateX, y: value.rotateY, z: value.rotateZ },
  };
};

/**
 * @param {object} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const transform = (endValue, { element, computed }) => {
  let startValue = computed.transform;

  const width = element.offsetWidth;
  const height = element.offsetHeight;

  startValue = parseTransform(startValue);
  endValue = parseTransform(endValue);

  const arr = [];

  // if (
  //   endValue.translate.x ||
  //   endValue.translate.y ||
  //   startValue.translate.x ||
  //   startValue.translate.y
  // ) {
  //   arr.push(
  //     _translate(
  //       [endValue.translate.x, endValue.translate.y],
  //       [startValue.translate.x, startValue.translate.y],
  //       [width, height]
  //     )
  //   );
  // }

  // if (
  //   endValue.scale.x ||
  //   endValue.scale.y ||
  //   startValue.scale.x ||
  //   startValue.scale.y
  // ) {
  //   arr.push(
  //     _scale(
  //       [endValue.scale.x, endValue.scale.y],
  //       [startValue.scale.x, startValue.scale.y]
  //     )
  //   );
  // }

  if (
    endValue.rotate.x ||
    endValue.rotate.y ||
    endValue.rotate.z ||
    startValue.rotate.x ||
    startValue.rotate.y ||
    startValue.rotate.z
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
