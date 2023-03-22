module.exports = {
  src: "src/",
  dest: "./../package-test/dist/",
  js: {
    entry: "index.js",
    watch: [
      "src/index.js",
      "src/**/**/*",
      "src/**/**/**/*",
      "src/**/**/**/**/*",
    ],
    dest: "main.js",
  },
};
