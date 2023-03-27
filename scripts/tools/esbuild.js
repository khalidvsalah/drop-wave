const fs = require("fs");

const esbuild = require("esbuild");
const uglify = require("uglify-js");

async function Bundle(src, dir, output, mode) {
  var e = src + dir;
  var o = output + dir;

  var out = {
    entryPoints: [e],
    bundle: true,
    format: "esm",
    outfile: o,
  };

  await esbuild.build(out);

  var file = fs.readFileSync(o, "utf-8");
  file = mode ? uglify.minify(file).code : file;
  fs.writeFileSync(o, file, "utf-8");
}

module.exports = (o) => {
  o.js.entry.map((file) => {
    Bundle(o.src, file, o.output, o.mode).then(o.cb);
  });
};
