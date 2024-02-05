import { query } from '../../methods/methods';

/**
 * Check element type
 * @param {HTMLElement|String|Object} ele - targeted element.
 */
export default function element(ele) {
  this.obj = false;

  if (ele instanceof Node) {
    this.target = ele;
  } else if (typeof ele == 'string') {
    this.target = query.el(ele);
  } else {
    this.obj = true;
    this.target = ele;
  }
}
