const fs = require("fs");

const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify");

const conf = { entry: {}, output: {} };
const plugins = [];

function compileJs() {
  plugins.push(babel({ presets: [["@babel/preset-env", { modules: false }]] }));
  plugins.push(uglify.uglify());
}

function checkDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir);
}

module.exports = (o) => {
  checkDir(o.output);
  o.mode && compileJs();

  conf.entry.plugins = plugins;
  conf.entry.input = o.src + o.js.entry;

  conf.output.file = o.output + o.js.dest;
  conf.output.format = "esm";

  rollup.rollup(conf.entry).then((bundle) => {
    bundle.write(conf.output).then(o.cb);
  });
};
