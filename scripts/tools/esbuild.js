const fs = require("fs");

const esbuild = require("esbuild");
const uglify = require("uglify-js");

async function Bundle(dir, output, mode) {
  await esbuild.build({
    entryPoints: [dir],
    bundle: true,
    outfile: output,
  });

  var file = fs.readFileSync(output, "utf-8");
  var src = await esbuild.transform(file, {
    format: "",
  });
  file = uglify.minify(src.code).code;

  fs.writeFileSync(output, mode ? file : src.code, "utf-8");
}

module.exports = (o) => {
  Bundle(o.src + o.js.entry, o.output + o.js.dest, o.mode).then(o.cb);
};
