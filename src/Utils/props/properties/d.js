import { lerp } from '../../../Math/math';
import ease from '../../../Math/ease';

const length = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
};

const segment = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

function parseValues(args) {
  const numbers = args.match(number);
  return numbers ? numbers.map(Number) : [];
}
function parse(path) {
  const data = [];

  path.replace(segment, function (_, command, args) {
    let type = command.toLowerCase();
    args = parseValues(args);

    if (type === 'm' && args.length > 2) {
      data.push([command].concat(args.splice(0, 2)));
      type = 'l';
      command = command === 'm' ? 'l' : 'L';
    }

    while (true) {
      if (args.length === length[type]) {
        args.unshift(command);
        return data.push(args);
      }
      if (args.length < length[type]) throw new Error('malformed path data');
      data.push([command].concat(args.splice(0, length[type])));
    }
  });
  return data;
}

const d = (p, { el, easing }) => {
  const s = parse(el.getAttribute('d'));
  const e = parse(p[0]);
  const curve = ease(p[1] || easing);

  return t => {
    let st = '';
    let value = '';

    for (let i = 0; i < s.length; i++) {
      const i1 = s[i];
      const i2 = e[i];

      for (let k = 0; k < i1.length; k++) {
        st += (isNaN(i1[k]) ? i1[k] : lerp(i1[k], i2[k], curve(t))) + ' ';
      }

      value = st.trim();
    }

    return value;
  };
};

const setValue = (e, v) => e.setAttribute('d', v);
export default { cb: d, setValue };
