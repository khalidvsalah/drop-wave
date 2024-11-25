const cubicBezier0 = (aA1) => 3 * aA1;
const cubicBezier1 = (aA1, aA2) => 1 - cubicBezier0(aA2) + cubicBezier0(aA1);
const cubicBezier2 = (aA1, aA2) => cubicBezier0(aA2) - 6 * aA1;
const calculateBezier = (t, aA1, aA2) => {
  return (
    ((cubicBezier1(aA1, aA2) * t + cubicBezier2(aA1, aA2)) * t +
      cubicBezier0(aA1)) *
    t
  );
};
function getSlope(aT, aA1, aA2) {
  return (
    cubicBezier0(cubicBezier1(aA1, aA2)) * Math.pow(aT, 2) +
    2 * cubicBezier2(aA1, aA2) * aT +
    cubicBezier0(aA1)
  );
}
const Subdivision = (aX, aA, aB, mX1, mX2) => {
  let h = 0;
  let a = 0;
  let o = 0;

  do {
    a = aA + (aB - aA) / 2;
    h = calculateBezier(a, mX1, mX2) - aX;
    if (h > 0) aB = a;
    else aA = a;
  } while (Math.abs(h) > 0.0000001 && ++o < 10);

  return a;
};
const iterate = (i, e, s, r) => {
  for (let t = 0; t < 4; ++t) {
    const a = getSlope(e, s, r);
    if (a === 0) return e;
    e -= (calculateBezier(e, s, r) - i) / a;
  }
  return e;
};
const customEasing = (slope) => {
  const [mX1, mY1, mX2, mY2] = slope.split(',');
  if (mX1 === mY1 && mX2 === mY2) return (x) => x;

  const o = new Float32Array(11);

  for (let i = 0; i < 11; ++i) {
    o[i] = calculateBezier(i * 0.1, mX1, mX2);
  }

  function getTForX(aX) {
    let intervalStart = 0;
    let currentSample = 1;

    for (; currentSample !== 10 && o[currentSample] <= aX; ++currentSample) {
      intervalStart += 0.1;
    }
    --currentSample;

    const dist =
      (aX - o[currentSample]) / (o[currentSample + 1] - o[currentSample]);
    const guessForT = intervalStart + dist * 0.1;

    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= 0.001) return iterate(aX, guessForT, mX1, mX2);
    else if (initialSlope === 0) return guessForT;
    else return Subdivision(aX, intervalStart, intervalStart + 0.1, mX1, mX2);
  }

  return (x) => {
    if (x === 0 || x === 1) return x;
    return calculateBezier(getTForX(x), mY1, mY2);
  };
};

export default customEasing;
