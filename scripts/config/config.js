module.exports = {
  src: "src/",
  dest: "dist/",
  js: {
    entry: [
      "Animation/Raf/Raf.js",
      "Animation/Delay/Delay.js",
      "Core/Route/Route.js",
      "Core/Timeline/Timeline.js",
      "Dom/Mount/Mount.js",
      "Dom/Events/Events.js",
      "Core/Math/Math.js",
    ],
    watch: [
      "src/index.js",
      "src/**/**/*",
      "src/**/**/**/*",
      "src/**/**/**/**/*",
    ],
    dest: "main.js",
  },
  mode: "PROD",
};
