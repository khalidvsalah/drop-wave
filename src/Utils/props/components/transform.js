const translate = p => {
  const o = {
    start: p ? p[0] : 0,
    end: p ? p[1] : 0,
    unit: p ? p[2] || 'px' : ''
  };
  o.lerp = o.end - o.start;
  return t => `${o.start + o.lerp * t}${o.unit}`;
};

const interpolation = p => {
  const lerp = p[1] - p[0];
  return t => `${p[0] + lerp * t}`;
};

const _translate = end => {
  const xV = translate(end[0]);
  const yV = translate(end[1]);
  return t => `translate3d(${xV(t)}, ${yV(t)}, 0)`;
};
const _scale = end => {
  const sxV = interpolation(end[0]);
  const syV = interpolation(end[1]);
  return t => `scale(${sxV(t)}, ${syV(t)})`;
};
const _rotate = end => {
  const rxV = interpolation(end[0]);
  const ryV = interpolation(end[1]);
  const rzV = interpolation(end[2]);
  return t => `rotate3d(${rxV(t)}deg, ${ryV(t)}deg, ${rzV(t)}deg)`;
};

/**
 * @param {object} p - transform properties animation end ponit .
 * @param {object} transform - Computed Style.
 * @return {(t:number)=> string}
 */
const transform = p => {
  if (p.s) [p.sx, p.sy] = [p.s, p.s];
  if (p.r) p.rz = p.r;

  const arr = [];

  if (p.x || p.y) arr.push(_translate([p.x, p.y]));
  if (p.sx || p.sy) arr.push(_scale([p.sx, p.sy]));
  if (p.rx || p.ry || p.rz) arr.push(_rotate([p.rx, p.ry, p.rz]));

  if (arr.length > 1) return t => arr.reduce((a, b) => a(t) + ' ' + b(t));
  else return arr[0];
};

const setValue = element => value => (element.style.transform = value);
export default { callback: transform, setValue };
