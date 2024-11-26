import {
  matrix2d,
  matrix3d,
  _translate,
  _scale,
  _rotate,
} from './transformBase';

/**
 * @param {object} target
 * @param {elementContextType}
 * @return {Function}
 */
const transform = (target, { element, computed, parent }) => {
  let startPoint = computed.transform;

  let width = computed.width;
  let height = computed.height;

  width = width === 'auto' ? parent.clientWidth : element.clientWidth;
  height = height === 'auto' ? parent.clientHeight : element.clientHeight;

  if (startPoint !== 'none') {
    const isMatrix3d = /3d/.exec(startPoint);
    const matrix = /\((.*)\)/.exec(startPoint);

    if (isMatrix3d) {
      startPoint = matrix3d(matrix);
    } else {
      startPoint = matrix2d(matrix);
    }
  } else {
    startPoint = {
      translate: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
      rotate: { x: 0, y: 0, z: 0 },
    };
  }

  if (target.scale != null) {
    [target.scaleX, target.scaleY] = [target.scale, target.scale];
  }
  if (target.rotate != null) {
    target.rotateZ = target.rotate;
  }

  const arr = [];

  if (
    target.x != null ||
    target.y != null ||
    startPoint.translate.x ||
    startPoint.translate.y
  ) {
    arr.push(
      _translate(
        [startPoint.translate.x, startPoint.translate.y],
        [target.x, target.y],
        [width, height]
      )
    );
  }
  if (
    target.scaleX != null ||
    target.scaleY != null ||
    startPoint.scale.x ||
    startPoint.scale.y
  ) {
    arr.push(
      _scale(
        [startPoint.scale.x, startPoint.scale.y],
        [target.scaleX, target.scaleY]
      )
    );
  }
  if (
    target.rotateX != null ||
    target.rotateY != null ||
    target.rotateZ != null ||
    startPoint.rotate.x ||
    startPoint.rotate.y ||
    startPoint.rotate.z
  ) {
    arr.push(
      _rotate(
        [startPoint.rotate.x, startPoint.rotate.y, startPoint.rotate.z],
        [target.rotateX, target.rotateY, target.rotateZ]
      )
    );
  }

  return (t) => arr.map((a) => a(t)).join(' ');
};

export default {
  name: 'transform',
  callback: transform,
};
