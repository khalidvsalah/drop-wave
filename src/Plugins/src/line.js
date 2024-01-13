import { computed } from '../../index';

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
const getWidth = (node) => {
  node.style.display = 'inline-block';
  return node.offsetWidth;
};

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

function measure(node, key, line) {
  const space = '&nbsp;';

  if (node.type === 3) {
    const word = key + space;
    line.value += word;
    line.words.push({ word, node: node.node });
  } else {
    for (let i = 0; i < key.value.length; i++) {
      const word = key.value[i] + space;
      line.value += word;
      line.words.push({ word, node: node.node });
    }
  }
}
function lines(text, span, width) {
  const line = { value: '', words: [] };
  const output = [];

  for (let i = 0; i < text.length; i++) {
    const node = text[i];

    for (let k = 0; k < node.value.length; k++) {
      const key = node.value[k];
      const prev = line.value.length - 1;

      measure(node, key, line);
      span.innerHTML = line.value;

      if (span.offsetWidth > width) {
        const sentance = line.value.substring(0, prev);
        line.words.pop();
        output.push({ sentance, words: line.words });

        if (text.length !== 1 || node.value.length !== 1) {
          k -= 1;
        }

        line.value = '';
        line.words = [];
      }
    }

    if (i === text.length - 1) {
      const sentance = line.value.substring(0, line.value.length - 1);
      output.push({ sentance, words: line.words });
    }
  }

  return output;
}
function wrapper(text, node, type) {
  if (type === 1) {
    return `<div class="line"><div class="sfx">${text}</div></div>`;
  } else if (type === 2) {
    let ele = document.createElement('span');

    if (node) {
      const a = node.cloneNode();
      a.innerHTML = text;
      ele.appendChild(a);
    } else {
      ele.innerHTML = text;
    }

    return `<div class="word" style="display: inline-block;">${ele.innerHTML}</div>`;
  } else if (type === 3) {
    return `<div class="letter" style="display: inline-block;">${text}</div>`;
  }
}

function output(node, arr, o = {}) {
  let sentance = '';

  for (let i = 0; i < arr.length; i++) {
    const key = arr[i].words;
    for (let k = 0; k < key.length; k++) {
      const word = key[k].word;

      if (o.letters) {
        let space = word.indexOf('&nbsp;') - 1;
        let letter = '';

        for (let j = 0; j < word.length; j++) {
          if (space === j) {
            letter += wrapper(word.slice(space), '', 3);
            break;
          } else {
            letter += wrapper(word[j], '', 3);
          }
        }

        sentance += wrapper(letter, key[k].node, 2);
      } else {
        sentance += wrapper(word, key[k].node, 2);
      }
    }

    node.innerHTML += wrapper(sentance, '', 1);
    sentance = '';
  }
}

function split(node, o) {
  let compute = computed(node);
  let span = document.createElement('div');

  init(span, compute);

  const width = getWidth(node);
  let text = splitText(node);

  filter(text);
  const arr = lines(text, span, width);

  document.body.removeChild(span);
  node.innerHTML = '';

  output(node, arr, o);

  return {
    lines: node.querySelectorAll('.sfx'),
    words: node.querySelectorAll('.word'),
    letters: node.querySelectorAll('.letter')
  };
}

export default split;
