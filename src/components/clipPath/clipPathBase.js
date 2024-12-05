import { getUnit, getValue, unitConventer } from '../../helpers/handleUnits';
import { NUMERIC, UNITS } from '../../helpers/regex';
import { lerp } from '../../math/math';

const NUMBER_REGEX = new RegExp(`${NUMERIC}[${UNITS}]?`, 'g');

/**
 * Handling Clip-Path circle shape.
 *
 * @param {string} startValue
 * @param {string} endValue
 * @param {Node} element
 * @returns {Function}
 */
const _circle = (startValue, endValue, element) => {
  const start = startValue.match(NUMBER_REGEX);
  const end = endValue.match(NUMBER_REGEX);

  startValue = {
    radius: unitConventer(start[0], element.offsetWidth, getUnit(end[0])),
    x: unitConventer(start[1] || '50%', element.offsetWidth, getUnit(end[1])),
    y: unitConventer(start[2] || '50%', element.offsetHeight, getUnit(end[2])),
  };

  endValue = {
    radius: getValue(end[0]),
    x: getValue(end[1]),
    y: getValue(end[2]),
  };

  return (t) =>
    `${lerp(startValue.radius.value, endValue.radius, t)}${
      startValue.radius.unit
    } at ${lerp(startValue.x.value, endValue.x, t)}${startValue.x.unit} ${lerp(
      startValue.y.value,
      endValue.y,
      t
    )}${startValue.y.unit}`;
};

/**
 * Returns array of pairs points for the polygon shap.
 *
 * @param {string} value
 * @returns {Array<Array<string>>}
 */
const getPairs = (value) => {
  return value.split(',').map((str) => {
    const value = str.match(NUMBER_REGEX);
    return [value[0], value[1]];
  });
};

/**
 * Handling Clip-Path polygon shape.
 *
 * @param {string} startValue
 * @param {string} endValue
 * @param {Node} element
 * @returns {Function}
 */
const _polygon = (startValue, endValue, element) => {
  const startPoints = getPairs(startValue);
  const endPoints = getPairs(endValue);
  const length = startPoints.length - 1;

  startValue = startPoints.map((pair, idx) => {
    const x = unitConventer(
      pair[0],
      element.offsetWidth,
      getUnit(endPoints[idx][0])
    );
    const y = unitConventer(
      pair[1],
      element.offsetHeight,
      getUnit(endPoints[idx][1])
    );
    return [x, y];
  });
  endValue = endPoints.map((pair) => {
    const x = getValue(pair[0]);
    const y = getValue(pair[1]);
    return [x, y];
  });

  return (t) => {
    return startValue
      .map(([x, y], idx) => {
        const [eX, eY] = endValue[idx];
        const comma = idx === length ? '' : ', ';
        return (
          `${lerp(x.value, eX, t)}${x.unit} ${lerp(y.value, eY, t)}${y.unit}` +
          comma
        );
      })
      .join('');
  };
};

/**
 *
 * @param {string} value
 * @returns {Array<string>}
 */
const parseInset = (value) => {
  const points = value.match(NUMBER_REGEX);
  return [
    points[0],
    points[1] || points[0],
    points[2] || points[0],
    points[3] || points[1] || points[0],
  ];
};

/**
 * Handling Clip-Path inset shape.
 *
 * @param {string} startValue
 * @param {string} endValue
 * @param {Node} element
 * @returns {Function}
 */
const _inset = (startValue, endValue, element) => {
  const startPoints = parseInset(startValue);
  const endPoints = parseInset(endValue);
  const length = startPoints.length - 1;

  startValue = startPoints.map((point, idx) => {
    return unitConventer(point, element.offsetWidth, getUnit(endPoints[idx]));
  });
  endValue = endPoints.map((point) => getValue(point));

  return (t) =>
    startValue
      .map((point, idx) => {
        const space = idx === length ? '' : ' ';
        return lerp(point.value, endValue[idx], t) + point.unit + space;
      })
      .join('');
};

export { _circle, _polygon, _inset };
