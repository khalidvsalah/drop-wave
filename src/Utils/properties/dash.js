const dash = (d, n) => {
  const dV = {
    s: parseFloat(n.strokeDashoffset),
    e: d[0]
  };

  dV.lerp = dV.e - dV.s;
  return (e) => `${dV.s + dV.lerp * e}`;
};

const setValue = (e, v) => (e.style.strokeDashoffset = v);

export default {
  cb: dash,
  setValue
};
