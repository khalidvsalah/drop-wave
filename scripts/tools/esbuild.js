const fs = require("fs");

const esbuild = require("esbuild");
const uglify = require("uglify-js");

async function Bundle(dir, output, mode) {
  var o = {
    entryPoints: dir,
    bundle: true,
    format: "esm",
    outfile: output,
  };

  await esbuild.build(o);

  var file = fs.readFileSync(output, "utf-8");
  file = mode ? uglify.minify(file).code : file;
  fs.writeFileSync(output, file, "utf-8");
}

module.exports = (o) => {
  var entry = [o.src + o.js.entry];
  var output = o.output + o.js.dest;

  Bundle(entry, output, o.mode).then(o.cb);
};
