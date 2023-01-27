const props = {
  transform: (x, y, n) => {
    var xV, yV;
    var t = n.transform;
    var tR = t !== "none" && t.match(/\((.+)\)$/)[1].split(", ");

    if (tR) {
      xV = {
        s: +tR[4],
        e: x ? x[1] : 0,
      };

      yV = {
        s: +tR[5],
        e: y ? y[1] : 0,
      };
    } else {
      xV = {
        s: x[0],
        e: x[1],
      };
      yV = {
        s: y[0],
        e: y[1],
      };
    }

    xV.lerp = xV.e - xV.s;
    yV.lerp = yV.e - yV.s;
    xV.unit = x[2] ? x[2] : "px";
    yV.unit = y[2] ? y[2] : "px";

    if ((x && y) || tR) {
      return (e) =>
        `translate3d(
          ${xV.s + xV.lerp * e}${xV.unit}, 
          ${yV.s + yV.lerp * e}${yV.unit},
          0)`;
    } else {
      if (x) {
        return (e) => `translateX(${xV.s + xV.lerp * e}${xV.unit})`;
      } else if (y) {
        return (e) => `translateY(${yV.s + yV.lerp * e}${yV.unit})`;
      }
    }
  },
  opacity: (o) => {
    var oV = {
      s: o[0],
      end: o[1],
      lerp: o[1] - o[0],
    };
    return (e) => `${oV.s + oV.lerp * e}`;
  },
  pointer: (e) => {
    return () => e;
  },
  display: (e) => {
    return () => e;
  },
};

export default props;
