const props = {
  transform: (x, y, sx, sy, n) => {
    var xV, yV, sX, sY;
    var t = n.transform;
    var tR = t !== "none" && t.match(/\((.+)\)$/)[1].split(", ");

    if (tR) {
      xV = {
        s: +tR[4],
        e: x ? (x[2] === "px" ? x[1] : (x[1] / 100) * parseFloat(n.width)) : 0,
        unit: "px",
      };

      yV = {
        s: +tR[5],
        e: y ? (y[2] === "px" ? y[1] : (y[1] / 100) * parseFloat(n.height)) : 0,
        unit: "px",
      };
    } else {
      xV = {
        s: x[0],
        e: x[1],
        unit: x[2] ? x[2] : "px",
      };
      yV = {
        s: y[0],
        e: y[1],
        unit: y[2] ? y[2] : "px",
      };
    }

    sX = {
      s: tR ? +tR[0] : sx[0] ? sx[0] : 1,
      e: sx[1] ? sx[1] : 1,
    };

    sY = {
      s: tR ? +tR[3] : sy[0] ? sy[0] : 1,
      e: sy[1] ? sy[1] : 1,
    };

    xV.lerp = xV.e - xV.s;
    yV.lerp = yV.e - yV.s;

    sX.lerp = sX.e - sX.s;
    sY.lerp = sY.e - sY.s;

    if ((x && y) || tR) {
      return (e) => {
        var rX = `${xV.s + xV.lerp * e}${xV.unit}`;
        var rY = `${yV.s + yV.lerp * e}${yV.unit}`;

        var rSX = `${sX.s + sX.lerp * e}`;
        var rSY = `${sY.s + sY.lerp * e}`;

        return `translate3d(${rX}, ${rY},0) scale(${rSX}, ${rSY})`;
      };
    } else {
      if (x) {
        return (e) => {
          var rX = `${xV.s + xV.lerp * e}${xV.unit}`;

          var rSX = `${sX.s + sX.lerp * e}`;
          var rSY = `${sY.s + sY.lerp * e}`;

          return `translateX(${rX}) scale(${rSX}, ${rSY})`;
        };
      } else if (y) {
        return (e) => {
          var rY = `${yV.s + yV.lerp * e}${yV.unit}`;

          var rSX = `${sX.s + sX.lerp * e}`;
          var rSY = `${sY.s + sY.lerp * e}`;

          return `translateY(${rY}) scale(${rSX}, ${rSY})`;
        };
      }
    }
  },
  opacity: (o, n) => {
    var oV = {
      s: n.opacity,
      e: o[1],
    };
    oV.lerp = oV.e - oV.s;
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
