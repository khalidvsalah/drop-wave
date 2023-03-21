const config = require("./config/config");
const rollup = require("./tools/rollup");

rollup({
  output: config.dest,
  js: config.js,
  src: config.src,
});
