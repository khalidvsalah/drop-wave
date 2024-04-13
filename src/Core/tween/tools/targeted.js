import query from '../../../Utils/methods/query';

/**
 * Check element type
 * @param {HTMLElement|String|Object} ele - targeted element.
 */
export default function element(ele) {
  this.isObj = false;

  if (ele instanceof Node) {
    this.target = ele;
  } else if (typeof ele == 'string') {
    this.target = query.el(ele);
  } else {
    this.isObj = true;
    this.target = ele;
  }
}
