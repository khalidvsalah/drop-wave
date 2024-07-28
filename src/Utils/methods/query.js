/** @typedef {(str:string)=> HTMLElement | object} Element*/
/** @typedef {(element:HTMLElement,str:string)=> HTMLElement | object} Elements*/
/**
 * @typedef {Object} QUERY
 * @property {Element} id
 * @property {Element} el
 * @property {Element} els
 * @property {Elements} sEl
 * @property {Elements} sEls
 * @property {Element} node
 * @property {Element} text
 */

/** @type {QUERY} */
export const query = {
  id: str => document.getElementById(str),
  el: str => document.querySelector(str),
  els: str => document.querySelectorAll(str),
  sEl: (element, str) => element.querySelector(str),
  sEls: (element, str) => element.querySelectorAll(str),
  node: str => document.createElement(str),
  text: str => document.createTextNode(str)
};
