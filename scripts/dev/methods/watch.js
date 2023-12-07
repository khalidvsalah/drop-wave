import fs from "fs";
import browser from "browser-sync";

import config from "../config/config.js";
import bundler from "../../common/methods/bundler/bundler.js";

const mode = config.mode === "PROD";
const bs = browser.create();

const bsConfig = {
  open: false,
  port: 4000,
  notify: false,
  logLevel: "silent",
};

bsConfig.proxy = "http://localhost/";
bs.init(bsConfig);

(() => {
  fs.rmSync(config.dest, { recursive: true, force: true });
  fs.mkdirSync(config.dest);
  bundler(config.langs.js, mode, "js");
})();

export default function watcher() {
  let keys = Object.keys(config.langs);
  keys.map((key) => {
    if (key !== "copy") {
      let lang = config.langs[key];

      bs.watch(lang.watch).on("change", (e, i) => {
        bundler(lang, mode, key);
      });
    }
  });
}
