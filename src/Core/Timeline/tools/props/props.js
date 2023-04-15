const props = {
  transform: (x, y, sx, sy, n) => {
    var xV, yV, sXV, sYV;
    var transform =
      n.transform !== "none" && n.transform.match(/\((.+)\)$/)[1].split(", ");

    if (transform) {
      xV = {
        s:
          x[1] === "px"
            ? +transform[4]
            : (+transform[4] / parseFloat(n.width)) * 100,
        e: x ? (x[1] === "px" ? x[0] : x[0]) : 0,
        unit: x[1] ? x[1] : "px",
      };

      yV = {
        s:
          y[1] === "px"
            ? +transform[5]
            : (+transform[5] / parseFloat(n.height)) * 100,
        e: y ? (y[1] === "px" ? y[0] : y[0]) : 0,
        unit: y[1] ? y[1] : "px",
      };
    } else {
      xV = {
        s: 0,
        e: x[0],
        unit: x[1] ? x[1] : "px",
      };

      yV = {
        s: 0,
        e: y[0],
        unit: y[1] ? y[1] : "px",
      };
    }

    sXV = {
      s: transform ? +transform[0] : sx[0] ? sx[0] : 1,
      e: sx[1] ? sx[1] : 1,
    };

    sYV = {
      s: transform ? +transform[3] : sy[0] ? sy[0] : 1,
      e: sy[1] ? sy[1] : 1,
    };

    xV.lerp = xV.e - xV.s;
    yV.lerp = yV.e - yV.s;

    sXV.lerp = sXV.e - sXV.s;
    sYV.lerp = sYV.e - sYV.s;

    if ((x && y) || transform) {
      return (e) => {
        var rX = x ? `${xV.s + xV.lerp * e}${xV.unit}` : xV.s + xV.unit;
        var rY = y ? `${yV.s + yV.lerp * e}${yV.unit}` : yV.s + yV.unit;

        var rSX = `${sXV.s + sXV.lerp * e}`;
        var rSY = `${sYV.s + sYV.lerp * e}`;

        return `translate3d(${rX}, ${rY}, 0) scale(${rSX}, ${rSY})`;
      };
    } else {
      if (x) {
        return (e) => {
          var rX = `${xV.s + xV.lerp * e}${xV.unit}`;

          var rSX = `${sXV.s + sXV.lerp * e}`;
          var rSY = `${sYV.s + sYV.lerp * e}`;

          return `translateX(${rX}) scale(${rSX}, ${rSY})`;
        };
      } else if (y) {
        return (e) => {
          var rY = `${yV.s + yV.lerp * e}${yV.unit}`;

          var rSX = `${sXV.s + sXV.lerp * e}`;
          var rSY = `${sYV.s + sYV.lerp * e}`;

          return `translateY(${rY}) scale(${rSX}, ${rSY})`;
        };
      }
    }
  },
  opacity: (o, n) => {
    var oV = {
      s: +n.opacity,
      e: o[0],
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
  top: (t, n, pH) => {
    var tV = {
      s: t[1] === "px" ? parseFloat(n.top) : (parseFloat(n.top) / pH) * 100,
      e: t[0],
    };

    tV.lerp = tV.e - tV.s;
    return (e) => `${tV.s + tV.lerp * e}${t[2]}`;
  },
};

export default props;
