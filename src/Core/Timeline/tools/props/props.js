const props = {
  transform: (x, y, sx, sy, n, store) => {
    let xV, yV, sXV, sYV;
    let transform =
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
      s: transform ? +transform[0] : 1,
      e: sx ? sx[0] : 1,
    };

    sYV = {
      s: transform ? +transform[3] : 1,
      e: sy ? sy[0] : 1,
    };

    xV.lerp = xV.e - xV.s;
    yV.lerp = yV.e - yV.s;

    sXV.lerp = sXV.e - sXV.s;
    sYV.lerp = sYV.e - sYV.s;

    if (store) {
      store["y"] = yV.s;
      store["x"] = xV.s;
      store["sy"] = sXV.s;
      store["sx"] = sYV.s;
    }

    if ((x && y) || (x.lerp && y.lerp)) {
      return (e) => {
        let rX = x ? `${xV.s + xV.lerp * e}${xV.unit}` : xV.s + xV.unit;
        let rY = y ? `${yV.s + yV.lerp * e}${yV.unit}` : yV.s + yV.unit;

        let rSX = `${sXV.s + sXV.lerp * e}`;
        let rSY = `${sYV.s + sYV.lerp * e}`;

        return `translate3d(${rX}, ${rY}, 0) scale(${rSX}, ${rSY})`;
      };
    } else {
      if (x) {
        return (e) => {
          let rX = `${xV.s + xV.lerp * e}${xV.unit}`;

          let rSX = `${sXV.s + sXV.lerp * e}`;
          let rSY = `${sYV.s + sYV.lerp * e}`;

          return `translateX(${rX}) scale(${rSX}, ${rSY})`;
        };
      } else if (y) {
        return (e) => {
          let rY = `${yV.s + yV.lerp * e}${yV.unit}`;

          let rSX = `${sXV.s + sXV.lerp * e}`;
          let rSY = `${sYV.s + sYV.lerp * e}`;

          return `translateY(${rY}) scale(${rSX}, ${rSY})`;
        };
      }
    }
  },
  opacity: (o, n, store) => {
    let oV = {
      s: +n.opacity,
      e: o[0],
    };

    oV.lerp = oV.e - oV.s;
    if (store) store["opacity"] = oV.s;

    return (e) => `${oV.s + oV.lerp * e}`;
  },
  pointer: (e) => {
    return () => e;
  },
  display: (e) => {
    return () => e;
  },
  top: (t, n, pH, store) => {
    let tV = {
      s: t[1] === "px" ? parseFloat(n.top) : (parseFloat(n.top) / pH) * 100,
      e: t[0],
    };

    tV.lerp = tV.e - tV.s;
    store["top"] = tV.s;
    if (store) store["top"] = tV.s;

    return (e) => `${tV.s + tV.lerp * e}${t[1]}`;
  },
};

export default props;
