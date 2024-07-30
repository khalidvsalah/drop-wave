import * as esbuild from 'esbuild';

import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';
import babel from 'esbuild-plugin-babel';

export default async function bundle({ src, dest }) {
  const entry = Array.isArray(src) ? src : [src];

  await esbuild.build({
    entryPoints: entry,
    bundle: true,
    outfile: dest,
    plugins: [minifyTemplates(), writeFiles(), babel()],
    minify: true,
    format: 'esm',
    write: false
  });
}
