const bs = require("browser-sync").create();
const colors = require("colors");

const config = require("./config/config");
const rollup = require("./tools/rollup");

function compileJs(t) {
  rollup({
    mode: false,
    output: config.dest,
    js: config.js,
    src: config.src,
    cb: reload({ CSS: false, t, color: "yellow", name: "<JS>" }),
  });
}
compileJs();

function time() {
  return +new Date();
}

function reload(o) {
  bs.reload();

  let timeMsg = "";
  if (o.t !== 0) {
    const duration = ((+new Date() - o.t) / 1000).toFixed(3);
    timeMsg = " in " + duration + " secondes";
  }
  // console.log(colors[o.color](o.name + " Built" + timeMsg));
}

const bsConfig = {
  open: false,
  port: 8080,
  notify: false,
  logLevel: "silent",
};

bsConfig.proxy = "http://localhost/";
bs.init(bsConfig);
bs.watch(config.js.watch).on("change", () => {
  const startTime = time();
  compileJs(startTime);
});
