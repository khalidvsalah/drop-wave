const props = {
  transform: (x, y, sx, sy, n) => {
    let xV, yV, sXV, sYV;
    let tr = n.transform;
    let t = tr !== "none" && tr.match(/\((.+)\)$/)[1].split(", ");

    if (t) {
      xV = {
        s: x[1] === "px" ? +t[4] : (+t[4] / parseFloat(n.width)) * 100,
        e: x ? x[0] : +t[4],
        unit: x[1] ? x[1] : "px",
      };
      yV = {
        s: y[1] === "px" ? +t[5] : (+t[5] / parseFloat(n.height)) * 100,
        e: y ? y[0] : +t[5],
        unit: y[1] ? y[1] : "px",
      };

      sXV = {
        s: +t[0],
        e: sx ? sx[0] : 1,
      };
      sYV = {
        s: +t[3],
        e: sy ? sy[0] : 1,
      };
    } else {
      xV = {
        s: 0,
        e: x[0] || 0,
        unit: x[1] ? x[1] : "px",
      };

      yV = {
        s: 0,
        e: y[0] || 0,
        unit: y[1] ? y[1] : "px",
      };

      sXV = {
        s: 1,
        e: sx[0] || 1,
      };

      sYV = {
        s: 1,
        e: sy[0] || 1,
      };
    }

    xV.lerp = xV.e - xV.s;
    yV.lerp = yV.e - yV.s;

    sXV.lerp = sXV.e - sXV.s;
    sYV.lerp = sYV.e - sYV.s;

    return (e) => {
      let rX = `${xV.s + xV.lerp * e}${xV.unit}`;
      let rY = `${yV.s + yV.lerp * e}${yV.unit}`;

      let rSX = `${sXV.s + sXV.lerp * e}`;
      let rSY = `${sYV.s + sYV.lerp * e}`;

      return `translate3d(${rX}, ${rY}, 0) scale(${rSX}, ${rSY})`;
    };
  },
  opacity: (o, n) => {
    let oV = {
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
    let tV = {
      s: t[1] === "px" ? parseFloat(n.top) : (parseFloat(n.top) / pH) * 100,
      e: t[0],
    };

    tV.lerp = tV.e - tV.s;
    return (e) => `${tV.s + tV.lerp * e}${t[1]}`;
  },
};

export default props;
