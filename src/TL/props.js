const props = {
  transform: (x, y) => {
    var xV = {
      start: x[0],
      end: x[1],
      unit: x[2] ? x[2] : "%",
      lerp: x[1] - x[0],
    };

    var yV = {
      start: y[0],
      end: y[1],
      unit: y[2] ? y[2] : "%",
      lerp: y[1] - y[0],
    };

    if (x && y) {
      return (e) =>
        `translate3d(
          ${xV.start + xV.lerp * e}${xV.unit}, 
          ${yV.start + yV.lerp * e}${yV.unit},
          0)`;
    } else {
      if (x) {
        return (e) => `translateX(${xV.start + xV.lerp * e}${xV.unit})`;
      } else if (y) {
        return (e) => `translateY(${yV.start + yV.lerp * e}${yV.unit})`;
      }
    }
  },
  opacity: (o) => {
    return (e) => `${o[1] * e}`;
  },
  pointer: (e) => {
    return () => e;
  },
  display: (e) => {
    return () => e;
  },
};

export default props;
