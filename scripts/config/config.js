module.exports = {
  src: "src/",
  dest: "../package-test/dist/",
  js: {
    entry: [
      "Animation/Raf/raf.js",
      "Animation/Delay/delay.js",
      "Core/Route/route.js",
      "Core/Timeline/timeline.js",
      "Core/Math/math.js",
      "Dom/Mount/mount.js",
      "Utils/Sub/sub.js",
    ],
    watch: [
      "src/index.js",
      "src/**/**/*",
      "src/**/**/**/*",
      "src/**/**/**/**/*",
    ],
    dest: "main.js",
  },
  mode: "DEV",
};
