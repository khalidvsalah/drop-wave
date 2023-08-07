import { Lerp } from "../../../../index";

const props = {
  t: (x, y, sx, sy, rx, ry, n) => {
    let xV, yV, sXV, sYV, rXV, rYV;
    let tr = n.transform;
    let t;

    if (tr.length > 6) t = tr.match(/\((.+)\)$/)[1].split(", ");

    if (t) {
      xV = {
        s: x
          ? x[1] === "px"
            ? +t[4]
            : (+t[4] / parseFloat(n.width)) * 100
          : +t[4],
        e: x ? x[0] : +t[4],
        unit: x[1] ? x[1] : "px",
      };
      yV = {
        s: y
          ? y[1] === "px"
            ? +t[5]
            : (+t[5] / parseFloat(n.height)) * 100
          : +t[5],
        e: y ? y[0] : +t[5],
        unit: y[1] ? y[1] : "px",
      };
      sXV = {
        s: +t[0],
        e: sx ? sx[0] : +t[0],
      };
      sYV = {
        s: +t[3],
        e: sy ? sy[0] : +t[3],
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
        e: sx ? sx[0] : 1,
      };
      sYV = {
        s: 1,
        e: sy ? sy[0] : 1,
      };
    }

    rXV = {
      s: rx ? rx[0] : 0,
      e: rx ? rx[1] : 0,
    };

    rYV = {
      s: ry ? ry[0] : 0,
      e: ry ? ry[1] : 0,
    };

    xV.lerp = xV.e - xV.s;
    yV.lerp = yV.e - yV.s;

    sXV.lerp = sXV.e - sXV.s;
    sYV.lerp = sYV.e - sYV.s;

    rXV.lerp = rXV.e - rXV.s;
    rYV.lerp = rYV.e - rYV.s;

    if (rx || ry) {
      return (e) => {
        let eX = `${xV.s + xV.lerp * e}${xV.unit}`;
        let eY = `${yV.s + yV.lerp * e}${yV.unit}`;

        let eSX = `${sXV.s + sXV.lerp * e}`;
        let eSY = `${sYV.s + sYV.lerp * e}`;

        let eRX = `${rXV.s + rXV.lerp * e}deg`;
        let eRY = `${rYV.s + rYV.lerp * e}deg`;

        return `translate(${eX}, ${eY}) scale(${eSX}, ${eSY}) rotateX(${eRX}) rotateY(${eRY})`;
      };
    } else {
      return (e) => {
        let eX = `${xV.s + xV.lerp * e}${xV.unit}`;
        let eY = `${yV.s + yV.lerp * e}${yV.unit}`;

        let eSX = `${sXV.s + sXV.lerp * e}`;
        let eSY = `${sYV.s + sYV.lerp * e}`;

        return `translate(${eX}, ${eY}) scale(${eSX}, ${eSY})`;
      };
    }
  },
  o: (o, n) => {
    let oV = {
      s: +n.opacity,
      e: o[0],
    };

    oV.lerp = oV.e - oV.s;
    return (e) => `${oV.s + oV.lerp * e}`;
  },
  dash: (d, n) => {
    let dV = {
      s: parseFloat(n.strokeDashoffset),
      e: d[0],
    };

    dV.lerp = dV.e - dV.s;
    return (e) => `${dV.s + dV.lerp * e}`;
  },
  points(p, n) {
    const d = (t) => {
      let r = [];
      let arr = t.split(" ");
      let length = arr.length;

      for (let t = 0; t < length; t++) {
        let i = arr[t].split(",");
        let a = i.length;

        for (let t = 0; t < a; t++) {
          var n = i[t];
          r.push(isNaN(n) ? n : +n);
        }
      }

      return r;
    };

    let s = d(n.el.getAttribute("points"));
    let e = d(p[0]);

    return (t) => {
      let st = "";
      let value = "";

      for (let i = 0; i < s.length; i++) {
        st += Lerp(s[i], e[i], t) + " ";
        value = st.trim();
      }

      return value;
    };
  },
};

export default props;
