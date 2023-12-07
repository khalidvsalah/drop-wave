import fs from "fs";
import makeDir from "make-dir";

import { compileSass } from "compile-sass";
import postcss from "postcss";
import compress from "css-minify";
import mixins from "postcss-mixins";
import nested from "postcss-nested";
import simpleVars from "postcss-simple-vars";
import autoprefixer from "autoprefixer";
import minmax from "postcss-media-minmax";
import position from "postcss-position";
import colors from "colors";

const plugins = [mixins, simpleVars, nested, autoprefixer(), minmax, position];

export default (o) => {
  o.entry.map(async (e, i) => {
    const entry = o.entry[i];
    const dest = o.dest[i];

    const compileed = await compileSass(entry);

    postcss(plugins)
      .process(compileed, {
        from: entry,
      })
      .then(async (result) => {
        const compressed = o.mode ? await compress(result.css) : result.css;
        if (!fs.existsSync(dest)) await makeDir(dest);
        fs.writeFileSync(dest + "/style.css", compressed);
      })
      .then(o.cb)
      .catch((e) => {
        console.error(
          colors.red(e.message, "Error!!!, Something went wrong <CSS>...😈")
        );
      });
  });
};
