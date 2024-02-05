import fs from 'fs';

import { build } from 'esbuild';
import colors from 'colors';

import babel from 'esbuild-plugin-babel';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';

const string = `/* @khalidvsalah | Stabraq | v1.0.0 | MIT License | https://github.com/khalidvsalah/stabraq | https://www.khalidsalah.com */`;
function config(entry, options) {
  let plugins = [minifyTemplates(), writeFiles(), babel()];

  return {
    entryPoints: [entry],
    bundle: true,
    format: options.format,
    plugins,
    minify: true,
    outfile: options.output,
    allowOverwrite: true,
    write: false
  };
}

async function bundleJS(entry, options) {
  try {
    await build(config(entry, options));
    if (options.mode) {
      let file = fs.readFileSync(options.output, 'utf-8');
      fs.writeFileSync(options.output, string + file, 'utf-8');
    }
  } catch (e) {
    console.error(
      e.message,
      colors.red('Error!!!, Something went wrong <JS>...😈')
    );
  }
}

export default o => {
  o.entry.map(async (e, i) => {
    const entry = e;
    const dests = o.dest[i];
    const options = {
      format: 'esm',
      output: dests,
      mode: o.mode,
      eslint: o.eslint
    };

    if (typeof dests == 'object') {
      for (let i = 0; i < dests.length; i++) {
        const { format, dest } = dests[i];
        options.format = format;
        options.output = dest;
        await bundleJS(entry, options);
      }
    } else {
      await bundleJS(entry, options).then(o.cb);
    }
  });
};
