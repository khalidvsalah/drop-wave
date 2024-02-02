const dash = (d, n) => {
  const length = n.el.getTotalLength();
  n.el.style.strokeDasharray = length;

  const dV = { s: d[0] * length, e: d[1] * length };

  dV.lerp = dV.e - dV.s;
  return e => `${dV.s + dV.lerp * e}`;
};

const setValue = (e, v) => (e.style.strokeDashoffset = v);
export default { cb: dash, setValue };
