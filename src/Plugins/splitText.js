import { query } from '../Utils/methods/query';
import { computed } from '../Utils/methods/coordinate';

const space = ' ';

/**
 * @param {HTMLElement} node - placeholder element.
 * @param {HTMLElement} element - actual element.
 */
function placeholder(node, element) {
  const style = computed(element);

  document.body.append(node);

  node.style.visibility = 'hidden';
  node.style.position = 'absolute'; // to remove padding
  node.style.whiteSpace = 'nowrap';

  node.style.fontFamily = style.getPropertyValue('font-family');
  node.style.fontSize = style.getPropertyValue('font-size');
  node.style.fontWeight = style.getPropertyValue('font-weight');

  node.style.textTransform = style.getPropertyValue('text-transform');
  node.style.letterSpacing = style.getPropertyValue('letter-spacing');
  node.style.lineHeight = style.getPropertyValue('line-height');
}

function nodes(element) {
  const nodes = element.childNodes;
  const output = [];

  for (let i = 0; i < nodes.length; i++) {
    output.push(types(nodes[i]));
  }

  return output;
}
function types(node) {
  switch (node.nodeType) {
    case 3:
      return { value: node.nodeValue, type: 'TEXT' };
    case 1:
      // node.style.display = 'inline';
      return { value: nodes(node), type: 'ELEMENT', parent: node };
  }
}
function clean(splited) {
  for (let k = 0; k < splited.length; k++) {
    let { type, value } = splited[k];

    if (type === 'TEXT') {
      value = value.replace(/\n/g, '');

      const output = [];
      const words = value.split(' ');

      for (let i = 0; i < words.length; i++) {
        if (words[i] !== '') output.push(words[i]);
      }

      splited[k].value = output;
    } else clean(value);
  }
}

function checkWidth(node, value, str, width, lines, wrapper) {
  let before = node.innerHTML;
  if (wrapper) wrapper.innerHTML = '';

  for (let k = 0; k < value.length; k++) {
    if (wrapper) {
      wrapper.innerHTML += value[k];
      node.innerHTML = before + wrapper.outerHTML + ' ';
    } else node.innerHTML += value[k];

    if (node.offsetWidth > width) {
      lines.push(wrap(str.value.trim(), 'LINE'));
      if (wrapper) wrapper.innerHTML = '';
      node.innerHTML = '';
      before = '';
      k -= 1;
    } else if (node.offsetWidth === width) {
      lines.push(wrap(node.innerHTML.trim(), 'LINE'));
      if (wrapper) wrapper.innerHTML = '';
      node.innerHTML = '';
      before = '';
    } else {
      if (wrapper) wrapper.innerHTML += ' ';
      else node.innerHTML += ' ';
    }

    str.value = node.innerHTML;
  }

  return str.value;
}

function wrap(text, type) {
  if (type === 'LINE') {
    return `<div class="pfx"><span class="tfx" style="display: inline-block;">${text}</span></div>`;
  } else if (type === 'WORD') {
    return `<span class="word" style="display: inline-block;">${text}</span>`;
  } else if (type === 'LETTER') {
    return `<span class="ltr" style="display: inline-block;">${text}</span>`;
  }
}

function letters(word) {
  let letters = word.split('').map(letter => wrap(letter, 'LETTER'));
  return letters.join('');
}
function splitLetter(children) {
  let str = '';
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    for (let k = 0; k < child.value.length; k++) {
      if (child.type === 'TEXT') {
        child.value[k] = letters(child.value[k]);
        str += child.value[k] + space;
      } else {
        child.parent.innerHTML = splitLetter(child.value);
        str += child.parent.outerHTML;
      }
    }
  }
  return str;
}
function splitWords(children, letter) {
  let str = '';
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    for (let k = 0; k < child.value.length; k++) {
      if (child.type === 'TEXT') {
        if (letter) child.value[k] = letters(child.value[k]);
        child.value[k] = wrap(child.value[k], 'WORD');
        str += child.value[k] + space;
      } else {
        child.parent.innerHTML = splitWords(child.value, letter);
        str += child.parent.outerHTML;
      }
    }
  }
  return str;
}
function splitLines(node, children, width, str, wrapper) {
  const arr = [];
  for (let i = 0; i < children.length; i++) {
    const { type, value, parent } = children[i];
    if (type === 'TEXT') checkWidth(node, value, str, width, arr, wrapper);
    else {
      const lines = splitLines(node, value, width, str, parent);
      lines.map(line => arr.push(line));
    }
  }
  return arr;
}

/**
 * @param {HTMLElement} element - property name
 * @param {{line:boolean, word:boolean, letter:boolean}} o
 * @returns {{letters:Array, words:Array, lines:Array}}
 */
export function splitText(element, options = {}) {
  const children = nodes(element);
  const width = element.offsetWidth;
  const node = document.createElement('div');
  const str = { value: '' };

  let lines = [];

  clean(children); // cleaning

  if (options.lines) {
    placeholder(node, element);
    if (options.words) splitWords(children, options.letters);
    else if (options.letters) splitLetter(children);
    lines = splitLines(node, children, width, str);
    if (str.value) lines.push(wrap(str.value.trim(), 'LINE'));
    document.body.removeChild(node);
  } else if (options.words) lines = [splitWords(children, options.letters)];
  else if (options.letters) lines = [splitLetter(children)];

  if (lines.length) {
    element.innerHTML = '';
    lines.map(line => (element.innerHTML += line));
  }

  return {
    lines: query.sEls(element, '.tfx'),
    words: query.sEls(element, '.word'),
    letters: query.sEls(element, '.ltr')
  };
}
