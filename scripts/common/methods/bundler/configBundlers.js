import esbuild from "../../tools/esbuild.js";

const obj = {
  js: {
    fn: esbuild,
    options: { name: "<JS>", color: "yellow", css: false },
  },
};

export default obj;
