import { NUMERIC } from '../../helpers/regex';
import { _blur, _gray, _contrast } from './filterBase';

const BLUR_REGEX = new RegExp('blur\\(' + NUMERIC);
const GRAY_REGEX = new RegExp('grayscale\\(' + NUMERIC);
const CONTRAST_REGEX = new RegExp('contrast\\(' + NUMERIC);

const getFilterValue = (regex, str) => {
  let blurStartValue = regex.exec(str);
  blurStartValue = blurStartValue ? +blurStartValue[1] : 0;
  return blurStartValue;
};

/**
 * @param {string} endValue
 * @param {DOMElementContext}
 * @return {Function}
 */
function filter(endValue, { computed }) {
  const startVaue = computed.filter;

  const blur = BLUR_REGEX.test(startVaue === 'none' ? endValue : startVaue);
  const grayscale = GRAY_REGEX.test(
    startVaue === 'none' ? endValue : startVaue,
  );
  const contrast = CONTRAST_REGEX.test(
    startVaue === 'none' ? endValue : startVaue,
  );

  const filters = [];

  if (blur) {
    filters.push(
      _blur(
        getFilterValue(BLUR_REGEX, startVaue),
        getFilterValue(BLUR_REGEX, endValue),
      ),
    );
  }
  if (grayscale) {
    filters.push(
      _gray(
        getFilterValue(GRAY_REGEX, startVaue),
        getFilterValue(GRAY_REGEX, endValue),
      ),
    );
  }
  if (contrast) {
    filters.push(
      _contrast(
        getFilterValue(CONTRAST_REGEX, startVaue),
        getFilterValue(CONTRAST_REGEX, endValue),
      ),
    );
  }

  return (t) => filters.map((filter) => filter(t)).join(' ');
}

export default {
  name: 'filter',
  callback: filter,
};
