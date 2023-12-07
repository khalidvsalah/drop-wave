import bundlers from "./configBundlers.js";
import colors from "colors";

function time() {
  return +new Date();
}

function color(o) {
  let timeMsg = "";
  if (o.t !== 0) {
    timeMsg = " in " + ((time() - o.time) / 1000).toFixed(3) + " secondes";
  }
  console.log(colors[o.color](o.name + " Built" + timeMsg));
}

export default function bundler(config, mode, lg) {
  let c = bundlers[lg];

  return new Promise((resolve) => {
    c.fn({
      entry: config.entry,
      dest: config.dest,
      eslint: config.eslint,
      mode,
      cb: () => {
        color({ ...c.options, time: time() });
        resolve();
      },
    });
  });
}
