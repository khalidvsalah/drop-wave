import ease from '../../../Math/ease';

const dash = (d, { el, easing }) => {
  const length = el.getTotalLength();
  el.style.strokeDasharray = length;

  const dV = {
    s: d[1] * length,
    e: d[0] * length,
    ease: d[2] ? ease(d[2]) : easing
  };

  dV.lerp = dV.e - dV.s;
  return e => `${dV.s + dV.lerp * dV.ease(e)}`;
};

const setValue = (e, v) => (e.style.strokeDashoffset = v);
export default { cb: dash, setValue };
