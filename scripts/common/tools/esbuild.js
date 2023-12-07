import fs from 'fs';

import { build } from 'esbuild';
import colors from 'colors';

import eslint from 'esbuild-plugin-eslint';
import babel from 'esbuild-plugin-babel';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';

const string =
  '/* @khalidvsalah | blinkwave | v0.0.1 | MIT License | https://github.com/khalidvsalah/blink-wave */ ';

function config(entry, dest, mode, config) {
  let plugins = [
    minifyTemplates(),
    writeFiles()
    // eslint({ baseConfig: config }),
    // babel(),
  ];

  let o = {
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    plugins,
    minify: false,
    outfile: dest,
    write: !mode
  };

  return o;
}

async function bundleJS(entry, dest, mode, eslint) {
  try {
    await build(config(entry, dest, mode, eslint));

    if (mode) {
      let file = fs.readFileSync(dest, 'utf-8');
      fs.writeFileSync(dest, string + file, 'utf-8');
    }
  } catch (e) {
    console.error(
      e.message,
      colors.red('Error!!!, Something went wrong <JS>...😈')
    );
  }
}

export default (o) => {
  o.entry.map((e, i) => {
    let entry = e;
    let dest = o.dest[i];

    bundleJS(entry, dest, o.mode, o.eslint).then(o.cb);
  });
};
