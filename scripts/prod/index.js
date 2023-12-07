import config from "./config/config.js";
import bundler from "../common/methods/bundler/bundler.js";

const mode = config.mode === "PROD";
bundler(config.langs.js, mode, "js");
