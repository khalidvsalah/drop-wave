import fs from 'fs';

import { build } from 'esbuild';
import colors from 'colors';

import eslint from 'esbuild-plugin-eslint';
import babel from 'esbuild-plugin-babel';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';

const string = `/* @khalidvsalah | Stabraq | v1.0.0 | MIT License | https://github.com/khalidvsalah/stabraq */`;
function config(entry, options) {
  let plugins = [
    minifyTemplates()
    // writeFiles(),
    // eslint({ baseConfig: options.eslint }),
    // babel()
  ];

  return {
    entryPoints: [entry],
    bundle: true,
    format: options.format,
    // plugins,
    minify: false,
    outfile: options.output
    // write: !options.mode
  };
}

async function bundleJS(entry, options) {
  try {
    await build(config(entry, options));

    // if (options.mode) {
    //   let file = fs.readFileSync(options.output, 'utf-8');
    //   fs.writeFileSync(options.output, string + file, 'utf-8');
    // }
  } catch (e) {
    console.error(
      e.message,
      colors.red('Error!!!, Something went wrong <JS>...😈')
    );
  }
}

export default (o) => {
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
      dests.map(async ({ format, dest }) => {
        options.format = format;
        options.output = dest;
        bundleJS(entry, options);
      });
    } else {
      await bundleJS(entry, options).then(o.cb);
    }
  });
};
