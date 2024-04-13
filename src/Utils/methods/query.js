const query = {
  id: s => document.getElementById(s),
  el: s => document.querySelector(s),
  els: s => [...document.querySelectorAll(s)],
  sEl: (e, s) => e.querySelector(s),
  sEls: (e, s) => [...e.querySelectorAll(s)],
  node: type => document.createElement(type),
  text: text => document.createTextNode(text)
};

export default query;
