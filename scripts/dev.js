const bs = require("browser-sync").create();
const colors = require("colors");

const config = require("./config/dev");
const esbuild = require("./tools/esbuild");

var prod = config.mode === "PROD";

function compileJs(t) {
  esbuild({
    mode: prod,
    output: config.dest,
    js: config.js,
    src: config.src,
    cb: () => reload({ CSS: false, t, color: "yellow", name: "<JS>" }),
  });
}
compileJs(time());

function time() {
  return +new Date();
}

function reload(o) {
  if (prod) return;
  bs.reload();
  let timeMsg = "";
  if (o.t !== 0) {
    const duration = ((+new Date() - o.t) / 1000).toFixed(3);
    timeMsg = " in " + duration + " secondes";
  }
  console.log(colors[o.color](o.name + " Built" + timeMsg));
}

if (!prod) {
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
}
