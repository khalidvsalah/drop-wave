import ease from '../../../Math/ease';

const dash = (d, { el }) => {
  const length = el.getTotalLength();
  const dV = { s: d[0] * length, e: d[1] * length, ease: ease(d[2]) };
  dV.lerp = dV.e - dV.s;
  return e => `${dV.s + dV.lerp * dV.ease(e)}`;
};

const setValue = (e, v) => (e.style.strokeDasharray = v);
export default { cb: dash, setValue };
