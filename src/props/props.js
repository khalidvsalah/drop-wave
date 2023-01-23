const props = {
  transform: (x, y) => {
    var xV = {
      start: x[0],
      end: x[1],
      unit: x[2] ? x[2] : "%",
    };

    var yV = {
      start: y[0],
      end: y[1],
      unit: y[2] ? y[2] : "%",
    };

    if (x && y) {
      return (e) =>
        `translate3d(${xV.end * e}${xV.unit}, ${yV.end * e}${yV.unit}, 0)`;
    } else {
      if (x) {
        return (e) => `translateX(${xV.end * e}${xV.unit})`;
      } else if (y) {
        return (e) => `translateY(${yV.end * e}${yV.unit})`;
      }
    }
  },
  opacity: (o) => {
    return (e) => `${o[1] * e}`;
  },
};

export default props;
