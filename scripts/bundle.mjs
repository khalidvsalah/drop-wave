import fs from 'fs';
import config from './configs/config.mjs';
import JS from './bundlers/esbuild.mjs';

const {
  dest,
  watchMode,
  changes: { js }
} = config;

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}
if (js) {
  if (Array.isArray(js.src)) {
    js.src.map(async (e, i) =>
      JS({
        src: e,
        dest: js.dest[i],
        eslint: js.eslint,
        watchMode
      })
    );
  } else {
    JS({
      src: js.src,
      dest: js.dest,
      eslint: js.eslint,
      watchMode
    });
  }
}
