import query from '../../Utils/methods/query';
import { computed } from '../../Utils/methods/eleProps';

const space = ' ';

function init(div, compute) {
  document.body.append(div);

  div.style.visibility = 'hidden';
  div.style.position = 'absolute'; // to remove padding
  div.style.whiteSpace = 'nowrap';

  div.style.fontFamily = compute.getPropertyValue('font-family');
  div.style.fontSize = compute.getPropertyValue('font-size');
  div.style.fontWeight = compute.getPropertyValue('font-weight');

  div.style.textTransform = compute.getPropertyValue('text-transform');
  div.style.letterSpacing = compute.getPropertyValue('letter-spacing');
  div.style.lineHeight = compute.getPropertyValue('line-height');
}

function splitText(node) {
  const nodes = node.childNodes;
  const output = [];

  for (let i = 0; i < nodes.length; i++) {
    output.push(types(nodes[i]));
  }

  return output;
}
function types(node) {
  let output;

  if (node.nodeType === 3) {
    output = { value: node.nodeValue.split(' '), type: 3 };
  } else {
    output = { value: splitText(node), type: 1, node };
  }

  return output;
}
function filter(text) {
  for (let i = 0; i < text.length; i++) {
    const key = text[i];

    if (key.type === 3) {
      const value = [];

      for (let k = 0; k < key.value.length; k++) {
        key.value[k] = key.value[k].replace(/\n/g, '');
        if (key.value[k] !== '') value.push(key.value[k]);
      }

      key.value = value;
    } else {
      filter(key.value);
    }
  }
}
function domOutput(lines, output, o) {
  if (o.words) {
    const len = lines.words.length;
    let line;

    if (o.ltrs) {
      line = lines.words.reduce((a, b, i) => {
        let str = '';
        for (let i = 0; i < b.length; i++) str += wrap(b[i], 3);
        return a + wrap(str + (i == len - 1 ? '' : space), 2);
      }, '');
    } else {
      line = lines.words.reduce((a, b, i) => {
        return a + wrap(b + (i == len - 1 ? '' : space), 2);
      }, '');
    }
    output.push({ line: wrap(line, 1) });
  } else {
    output.push({ line: wrap(lines.value, 1) });
  }
}

function wrap(text, type) {
  if (type === 1) {
    return `<div class="tfx"><span>${text}</span></div>`;
  } else if (type === 2) {
    return `<span class="word">${text}</span>`;
  } else if (type === 3) {
    return `<span class="ltr">${text}</span>`;
  }
}
function check(value, lines, div, width, output, o) {
  for (let k = 0; k < value.length; k++) {
    const word = value[k];

    lines.value += word;
    div.innerHTML = lines.value;

    lines.words.push(word);

    if (div.offsetWidth > width) {
      lines.words.pop();
      domOutput(lines, output, o);

      lines.value = word;
      lines.words = [word + space];
    }

    lines.value += space;
  }
}
function newline(obj, div, width, o) {
  const lines = { value: '', words: [] };
  const output = [];

  for (let i = 0; i < obj.length; i++) {
    const node = obj[i];
    if (node.type === 3) {
      check(node.value, lines, div, width, output, o);
    } else {
    }
  }

  domOutput(lines, output, o);
  return output;
}

function split(node, o) {
  let compute = computed(node);
  let div = document.createElement('div');

  if (o.ltrs) o.words = true;
  init(div, compute);

  const width = node.offsetWidth;
  let obj = splitText(node);

  filter(obj);

  const output = newline(obj, div, width, o);
  node.innerHTML = '';

  document.body.removeChild(div);
  output.map(({ line }) => (node.innerHTML += line));

  return {
    lines: query.sEls(node, '.tfx'),
    words: query.sEls(node, '.word'),
    ltrs: query.sEls(node, '.ltr')
  };
}

export default split;
