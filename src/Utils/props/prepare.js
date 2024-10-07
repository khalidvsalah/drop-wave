import { processDOMElement, processObjectProperties } from './processing';

/**
 * @param {HTMLElement} element - targeted element.
 * @param {object} props - properties.
 */
export function prepare(target, props) {
  if (target instanceof Node) return processDOMElement(target, props);
  else return processObjectProperties(target, props);
}
