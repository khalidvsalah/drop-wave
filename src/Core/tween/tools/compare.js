import { toString } from '../../../Utils/methods/object';

/**
 * @param {object} o1
 * @param {object} o2
 * @returns {boolean}
 */
const compare = (o1, o2) => toString(o1) === toString(o2);
export default compare;
