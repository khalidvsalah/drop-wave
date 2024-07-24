import { lerp } from '../../../Math/math';

const d = t => {
  const r = [];
  const arr = t.split(' ');
  const length = arr.length;

  for (let t = 0; t < length; t++) {
    const i = arr[t].split(',');
    const a = i.length;

    for (let t = 0; t < a; t++) {
      const n = i[t];
      r.push(isNaN(n) ? n : +n);
    }
  }

  return r;
};

const points = (p, { element }) => {
  const start = d(element.getAttribute('points'));
  const end = d(p[0]);

  return t => {
    let st = '';
    let value = '';

    for (let i = 0; i < s.length; i++) {
      st += lerp(s[i], e[i], t) + ' ';
      value = st.trim();
    }

    return value;
  };
};

const setValue = (element, value) => element.setAttribute('points', value);
export default { property: points, setValue };
