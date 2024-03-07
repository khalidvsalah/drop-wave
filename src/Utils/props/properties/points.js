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

const points = (p, { el }) => {
  const s = d(el.getAttribute('points'));
  const e = d(p[0]);
  const easing = ease(p[1]);

  return t => {
    let st = '';
    let value = '';

    for (let i = 0; i < s.length; i++) {
      st += lerp(s[i], e[i], easing(t)) + ' ';
      value = st.trim();
    }

    return value;
  };
};

const setValue = (e, v) => e.setAttribute('points', v);
export default { cb: points, setValue };
