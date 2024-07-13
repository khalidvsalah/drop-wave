import query from '../../../Utils/methods/query';

/**
 * Check element type
 * @param {HTMLElement|String|Object} element - targeted element.
 */
export default function targted(element) {
  this.isObj = false;

  if (element instanceof Node) this.target = element;
  else if (typeof element === 'string') this.target = query.el(element);
  else {
    this.isObj = true;
    this.target = element;
  }
}
